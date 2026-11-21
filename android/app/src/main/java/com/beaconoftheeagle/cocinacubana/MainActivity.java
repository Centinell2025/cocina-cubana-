package com.beaconoftheeagle.cocinacubana;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Message;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Offline recipe application. The bridge is exposed only to its own main-frame origin. */
public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final String ENTRY_URL = ORIGIN + "/assets/index.html";
    private static final String WEBVIEW_UPDATE_URL =
            "https://play.google.com/store/apps/details?id=com.google.android.webview";
    private static final int EXPORT_DOCUMENT = 1101;
    private static final int IMPORT_DOCUMENT = 1102;
    private static final int MAX_BACKUP_BYTES = 32 * 1024 * 1024;
    // JSON string escaping can almost double an otherwise valid backup payload.
    private static final int MAX_MESSAGE_CHARS = 2 * MAX_BACKUP_BYTES + 4096;
    private static final int MAX_TEXT_CHARS = 64_000;

    private final ExecutorService documents = Executors.newSingleThreadExecutor();
    private FrameLayout container;
    private WebView webView;
    private WebViewAssetLoader assetLoader;
    private DocumentRequest pendingDocument;
    private SpeechRequest pendingSpeech;
    private TextToSpeech speech;
    private boolean speechReady;
    private boolean speechInitializing;
    private boolean destroyed;
    private boolean backPending;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        container = new FrameLayout(this);
        container.setBackgroundColor(Color.WHITE);
        setContentView(container);
        configureInsets();
        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
        String restoredUrl = savedInstanceState == null ? null : savedInstanceState.getString("url");
        openRecipeScreen(isLocalUrl(restoredUrl) ? restoredUrl : ENTRY_URL);
    }

    private void configureInsets() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                int appearance = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                        | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                controller.setSystemBarsAppearance(appearance, appearance);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                            | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        }
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 29) {
            getWindow().setNavigationBarContrastEnforced(false);
        }
        container.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars()
                        | WindowInsets.Type.displayCutout());
                Insets keyboard = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right,
                        Math.max(bars.bottom, keyboard.bottom));
                return WindowInsets.CONSUMED;
            }
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        container.requestApplyInsets();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void openRecipeScreen(String url) {
        if (destroyed) return;
        releaseWebView();
        container.removeAllViews();
        backPending = false;
        if (!hasSupportedWebView()) {
            showNativeError(R.string.error_webview_old);
            return;
        }
        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSafeBrowsingEnabled(true);
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        webView.setWebViewClient(new LocalContentClient());
        webView.setWebChromeClient(new RecipeChromeClient());
        webView.setDownloadListener((downloadUrl, userAgent, contentDisposition, mimeType, length) ->
                Toast.makeText(this, R.string.error_download, Toast.LENGTH_LONG).show());
        container.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            WebViewCompat.addWebMessageListener(webView, "CocinaNative",
                    Collections.singleton(ORIGIN), (view, message, sourceOrigin,
                            isMainFrame, replyProxy) -> {
                        if (!isMainFrame || !isExactOrigin(sourceOrigin)) return;
                        handleMessage(message, replyProxy);
                    });
        } else {
            new AlertDialog.Builder(this)
                    .setTitle(R.string.app_name)
                    .setMessage(R.string.error_bridge)
                    .setPositiveButton(R.string.update_webview,
                            (dialog, which) -> openExternal(Uri.parse(webViewUpdateUrl())))
                    .setNegativeButton(R.string.cancel, null)
                    .show();
        }
        webView.loadUrl(url);
    }

    private final class LocalContentClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            String scheme = request.getUrl().getScheme();
            // Inline images generated by the trusted local page are not network requests.
            if ("data".equalsIgnoreCase(scheme) || "blob".equalsIgnoreCase(scheme)) return null;
            if (!"GET".equals(request.getMethod()) || !isLocalUri(request.getUrl())) {
                return blockedResponse(403, "Forbidden");
            }
            WebResourceResponse response = assetLoader.shouldInterceptRequest(request.getUrl());
            return response == null ? blockedResponse(404, "Not Found") : response;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            if (isLocalUri(request.getUrl())) return false;
            if (request.isForMainFrame()) openExternal(request.getUrl());
            return true;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (isLocalUrl(url)) return false;
            openExternal(Uri.parse(url));
            return true;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) showNativeError(R.string.error_loading);
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request,
                                        WebResourceResponse response) {
            if (request.isForMainFrame()) showNativeError(R.string.error_loading);
        }

        @Override
        public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
            showNativeError(R.string.error_renderer);
            return true;
        }
    }

    private final class RecipeChromeClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            if (!isLocalUrl(url)) { result.cancel(); return true; }
            new AlertDialog.Builder(MainActivity.this)
                    .setTitle(R.string.app_name)
                    .setMessage(shortText(message, 2000))
                    .setPositiveButton(R.string.accept, (dialog, which) -> result.confirm())
                    .setOnCancelListener(dialog -> result.cancel())
                    .show();
            return true;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
            if (!isLocalUrl(url)) { result.cancel(); return true; }
            new AlertDialog.Builder(MainActivity.this)
                    .setTitle(R.string.app_name)
                    .setMessage(shortText(message, 2000))
                    .setPositiveButton(R.string.accept, (dialog, which) -> result.confirm())
                    .setNegativeButton(R.string.cancel, (dialog, which) -> result.cancel())
                    .setOnCancelListener(dialog -> result.cancel())
                    .show();
            return true;
        }

        @Override
        public boolean onJsPrompt(WebView view, String url, String message,
                                  String defaultValue, JsPromptResult result) {
            result.cancel();
            return true;
        }

        @Override
        public void onPermissionRequest(PermissionRequest request) {
            request.deny();
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(String origin,
                                                       GeolocationPermissions.Callback callback) {
            callback.invoke(origin, false, false);
        }

        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                         FileChooserParams parameters) {
            // Imports use the bounded native importData action, never unrestricted WebView files.
            callback.onReceiveValue(null);
            return true;
        }

        @Override
        public boolean onCreateWindow(WebView view, boolean isDialog,
                                      boolean isUserGesture, Message resultMessage) {
            if (!isUserGesture) return false;
            WebView popup = new WebView(MainActivity.this);
            popup.getSettings().setJavaScriptEnabled(false);
            popup.getSettings().setAllowFileAccess(false);
            popup.getSettings().setAllowContentAccess(false);
            popup.setWebViewClient(new WebViewClient() {
                private boolean handled;
                private boolean route(Uri uri) {
                    if (handled) return true;
                    handled = true;
                    if (isLocalUri(uri) && webView != null) webView.loadUrl(uri.toString());
                    else openExternal(uri);
                    popup.post(popup::destroy);
                    return true;
                }
                @Override
                public boolean shouldOverrideUrlLoading(WebView target, WebResourceRequest request) {
                    return route(request.getUrl());
                }
                @Override
                public boolean shouldOverrideUrlLoading(WebView target, String url) {
                    return route(Uri.parse(url));
                }
                @Override
                public WebResourceResponse shouldInterceptRequest(WebView target,
                                                                   WebResourceRequest request) {
                    return blockedResponse(403, "Forbidden");
                }
            });
            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMessage.obj;
            transport.setWebView(popup);
            resultMessage.sendToTarget();
            // A window that never navigates must not retain a WebView indefinitely.
            popup.postDelayed(() -> {
                try { popup.destroy(); } catch (RuntimeException ignored) { }
            }, 15_000);
            return true;
        }
    }

    private void handleMessage(WebMessageCompat message, JavaScriptReplyProxy proxy) {
        Request request = new Request("", proxy);
        try {
            if (message.getType() != WebMessageCompat.TYPE_STRING) {
                respondError(request, R.string.error_request);
                return;
            }
            String raw = message.getData();
            if (raw == null || raw.length() > MAX_MESSAGE_CHARS) {
                respondError(request, R.string.error_file_size);
                return;
            }
            JSONObject envelope = new JSONObject(raw);
            String id = envelope.optString("id", "");
            if (id.isEmpty() || id.length() > 120) {
                respondError(request, R.string.error_request);
                return;
            }
            request = new Request(id, proxy);
            String action = envelope.optString("action", "");
            JSONObject payload = envelope.optJSONObject("payload");
            if (payload == null) payload = new JSONObject();
            switch (action) {
                case "shareText": shareText(request, payload); break;
                case "copyText": copyText(request, payload); break;
                case "exportData": exportData(request, payload); break;
                case "importData": importData(request); break;
                case "print": print(request, payload); break;
                case "speak": speak(request, payload); break;
                case "stopSpeech":
                    stopSpeech();
                    respond(request, true, object("stopped", true), null);
                    break;
                case "keepAwake":
                    boolean enabled = payload.optBoolean("enabled", false);
                    if (enabled) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    respond(request, true, object("enabled", enabled), null);
                    break;
                default: respondError(request, R.string.error_action);
            }
        } catch (JSONException | RuntimeException error) {
            respondError(request, R.string.error_request);
        }
    }

    private void shareText(Request request, JSONObject payload) {
        String text = boundedText(request, payload.optString("text", ""));
        if (text == null) return;
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_SUBJECT, shortText(payload.optString("title", getString(R.string.app_name)), 200));
        intent.putExtra(Intent.EXTRA_TEXT, text);
        try {
            startActivity(Intent.createChooser(intent, getString(R.string.share_chooser)));
            respond(request, true, object("opened", true), null);
        } catch (ActivityNotFoundException error) {
            respondError(request, R.string.error_external);
        }
    }

    private void copyText(Request request, JSONObject payload) {
        String text = boundedText(request, payload.optString("text", ""));
        if (text == null) return;
        ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
        if (clipboard == null) { respondError(request, R.string.error_action); return; }
        clipboard.setPrimaryClip(ClipData.newPlainText(getString(R.string.app_name), text));
        respond(request, true, object("copied", true), null);
    }

    private String boundedText(Request request, String text) {
        if (text.trim().isEmpty() || text.length() > MAX_TEXT_CHARS) {
            respondError(request, R.string.error_text);
            return null;
        }
        return text;
    }

    private void exportData(Request request, JSONObject payload) throws JSONException {
        if (pendingDocument != null) { respondError(request, R.string.error_busy); return; }
        String content = payload.optString("content", "");
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > MAX_BACKUP_BYTES) { respondError(request, R.string.error_file_size); return; }
        new JSONObject(content);
        String filename = shortText(payload.optString("filename", "mi-cocina-cubana.json"), 100)
                .replaceAll("[^A-Za-z0-9._-]", "_");
        if (filename.isEmpty() || filename.equals(".") || filename.equals("..")) filename = "mi-cocina-cubana.json";
        if (!filename.toLowerCase(Locale.ROOT).endsWith(".json")) filename += ".json";
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        pendingDocument = new DocumentRequest(request, bytes, filename);
        try {
            startActivityForResult(intent, EXPORT_DOCUMENT);
        } catch (ActivityNotFoundException error) {
            pendingDocument = null;
            respondError(request, R.string.error_file_picker);
        }
    }

    private void importData(Request request) {
        if (pendingDocument != null) { respondError(request, R.string.error_busy); return; }
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        intent.putExtra(Intent.EXTRA_MIME_TYPES,
                new String[]{"application/json", "text/json", "text/plain", "application/octet-stream"});
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);
        pendingDocument = new DocumentRequest(request, null, null);
        try {
            startActivityForResult(intent, IMPORT_DOCUMENT);
        } catch (ActivityNotFoundException error) {
            pendingDocument = null;
            respondError(request, R.string.error_file_picker);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != EXPORT_DOCUMENT && requestCode != IMPORT_DOCUMENT) return;
        DocumentRequest operation = pendingDocument;
        pendingDocument = null;
        if (operation == null) {
            if (resultCode == RESULT_OK) {
                Toast.makeText(this, R.string.error_file_interrupted, Toast.LENGTH_LONG).show();
            }
            return;
        }
        Uri uri = data == null ? null : data.getData();
        if (resultCode != RESULT_OK || uri == null) {
            respond(operation.request, false, null, "cancelled");
            return;
        }
        if (!"content".equalsIgnoreCase(uri.getScheme())) {
            respondError(operation.request, R.string.error_file_format);
            return;
        }
        documents.execute(() -> {
            if (requestCode == EXPORT_DOCUMENT) {
                try (OutputStream output = getContentResolver().openOutputStream(uri, "wt")) {
                    if (output == null || operation.bytes == null) throw new IllegalStateException();
                    output.write(operation.bytes);
                    output.flush();
                } catch (Exception error) {
                    respondError(operation.request, R.string.error_file_write);
                    return;
                }
                respond(operation.request, true, object("saved", true, "filename", operation.filename), null);
                return;
            }
            try (InputStream input = getContentResolver().openInputStream(uri);
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                if (input == null) throw new IllegalStateException();
                byte[] buffer = new byte[8192];
                int length;
                while ((length = input.read(buffer)) != -1) {
                    if (output.size() + length > MAX_BACKUP_BYTES) {
                        respondError(operation.request, R.string.error_file_size);
                        return;
                    }
                    output.write(buffer, 0, length);
                }
                String text = StandardCharsets.UTF_8.newDecoder()
                        .onMalformedInput(CodingErrorAction.REPORT)
                        .onUnmappableCharacter(CodingErrorAction.REPORT)
                        .decode(ByteBuffer.wrap(output.toByteArray())).toString();
                new JSONObject(text);
                respond(operation.request, true, object("text", text), null);
            } catch (JSONException error) {
                respondError(operation.request, R.string.error_file_format);
            } catch (Exception error) {
                respondError(operation.request, R.string.error_file_read);
            }
        });
    }

    private void print(Request request, JSONObject payload) {
        PrintManager manager = (PrintManager) getSystemService(PRINT_SERVICE);
        if (manager == null || webView == null) { respondError(request, R.string.error_print); return; }
        String title = shortText(payload.optString("title", getString(R.string.app_name)), 200);
        if (title.trim().isEmpty()) title = getString(R.string.app_name);
        PrintDocumentAdapter delegate = webView.createPrintDocumentAdapter(title);
        PrintDocumentAdapter adapter = new PrintDocumentAdapter() {
            @Override public void onStart() { delegate.onStart(); }
            @Override public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                                           CancellationSignal signal, LayoutResultCallback callback, Bundle extras) {
                delegate.onLayout(oldAttributes, newAttributes, signal, callback, extras);
            }
            @Override public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                                          CancellationSignal signal, WriteResultCallback callback) {
                delegate.onWrite(pages, destination, signal, callback);
            }
            @Override public void onFinish() {
                delegate.onFinish();
                if (!destroyed && webView != null) {
                    webView.evaluateJavascript("window.dispatchEvent(new Event('afterprint'));", null);
                }
            }
        };
        try {
            manager.print(title, adapter, new PrintAttributes.Builder().build());
            respond(request, true, object("opened", true), null);
        } catch (RuntimeException error) {
            if (webView != null) webView.evaluateJavascript("window.dispatchEvent(new Event('afterprint'));", null);
            respondError(request, R.string.error_print);
        }
    }

    private void speak(Request request, JSONObject payload) {
        String text = payload.optString("text", "");
        if (text.trim().isEmpty() || text.length() > TextToSpeech.getMaxSpeechInputLength()) {
            respondError(request, R.string.error_speech_text);
            return;
        }
        String tag = payload.optString("language", "es");
        Locale locale = Locale.forLanguageTag(tag);
        if (!"en".equals(locale.getLanguage()) && !"es".equals(locale.getLanguage())) {
            respondError(request, R.string.error_offline_voice);
            return;
        }
        SpeechRequest operation = new SpeechRequest(request, text, locale);
        if (speechReady) { speakWithOfflineVoice(operation); return; }
        if (speechInitializing) { respondError(request, R.string.error_speech_starting); return; }
        if (speech != null) { respondError(request, R.string.error_speech); return; }
        pendingSpeech = operation;
        speechInitializing = true;
        speech = new TextToSpeech(this, status -> {
            speechInitializing = false;
            speechReady = status == TextToSpeech.SUCCESS;
            SpeechRequest waiting = pendingSpeech;
            pendingSpeech = null;
            if (destroyed || waiting == null) return;
            if (speechReady) speakWithOfflineVoice(waiting);
            else respondError(waiting.request, R.string.error_speech);
        });
    }

    private void speakWithOfflineVoice(SpeechRequest operation) {
        try {
            Set<Voice> voices = speech.getVoices();
            Voice selected = null;
            int bestScore = Integer.MIN_VALUE;
            if (voices != null) for (Voice voice : voices) {
                Set<String> features = voice.getFeatures();
                if (voice.isNetworkConnectionRequired()
                        || (features != null && features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))
                        || !voice.getLocale().getLanguage().equals(operation.locale.getLanguage())) continue;
                int score = voice.getQuality();
                if (voice.getLocale().equals(operation.locale)) score += 10_000;
                if (!operation.locale.getCountry().isEmpty()
                        && voice.getLocale().getCountry().equals(operation.locale.getCountry())) score += 5_000;
                if (score > bestScore) { selected = voice; bestScore = score; }
            }
            if (selected == null || speech.setVoice(selected) != TextToSpeech.SUCCESS) {
                respondError(operation.request, R.string.error_offline_voice);
                return;
            }
            speech.setSpeechRate(0.92f);
            int result = speech.speak(operation.text, TextToSpeech.QUEUE_FLUSH, new Bundle(),
                    "cocina-" + operation.request.id);
            if (result == TextToSpeech.SUCCESS) respond(operation.request, true, object("started", true), null);
            else respondError(operation.request, R.string.error_speech);
        } catch (RuntimeException error) {
            respondError(operation.request, R.string.error_speech);
        }
    }

    private void stopSpeech() {
        if (pendingSpeech != null) {
            respond(pendingSpeech.request, false, null, "cancelled");
            pendingSpeech = null;
        }
        if (speech != null) speech.stop();
    }

    private void respondError(Request request, int resource) {
        respond(request, false, null, getString(resource));
    }

    private void respond(Request request, boolean ok, JSONObject result, String error) {
        JSONObject response = object("id", request.id, "ok", ok,
                "result", result == null ? JSONObject.NULL : result,
                "error", error == null ? JSONObject.NULL : error);
        runOnUiThread(() -> {
            if (destroyed || webView == null) return;
            try { request.proxy.postMessage(response.toString()); }
            catch (RuntimeException ignored) { /* The original page may have closed. */ }
        });
    }

    private static JSONObject object(Object... values) {
        JSONObject result = new JSONObject();
        try {
            for (int index = 0; index < values.length; index += 2) {
                result.put((String) values[index], values[index + 1]);
            }
        } catch (JSONException error) { throw new IllegalArgumentException(error); }
        return result;
    }

    private static String shortText(String text, int maximum) {
        return text.length() <= maximum ? text : text.substring(0, maximum);
    }

    private static boolean isExactOrigin(Uri uri) {
        return uri != null && "https".equalsIgnoreCase(uri.getScheme())
                && "appassets.androidplatform.net".equalsIgnoreCase(uri.getHost())
                && (uri.getPort() == -1 || uri.getPort() == 443)
                && uri.getUserInfo() == null;
    }

    private static boolean isLocalUri(Uri uri) {
        return isExactOrigin(uri) && uri.getPath() != null && uri.getPath().startsWith("/assets/");
    }

    private static boolean isLocalUrl(String url) {
        if (url == null) return false;
        try { return isLocalUri(Uri.parse(url)); }
        catch (RuntimeException error) { return false; }
    }

    private static WebResourceResponse blockedResponse(int status, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", status, reason,
                Collections.singletonMap("Cache-Control", "no-store"),
                new ByteArrayInputStream(new byte[0]));
    }

    private void openExternal(Uri uri) {
        if (uri == null) return;
        String scheme = uri.getScheme();
        Intent intent;
        if ("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme)) {
            intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
        } else if ("mailto".equalsIgnoreCase(scheme)) {
            intent = new Intent(Intent.ACTION_SENDTO, uri);
        } else return;
        try { startActivity(intent); }
        catch (ActivityNotFoundException error) {
            Toast.makeText(this, R.string.error_external, Toast.LENGTH_LONG).show();
        }
    }

    private static boolean hasSupportedWebView() {
        try {
            PackageInfo provider = WebView.getCurrentWebViewPackage();
            if (provider == null || provider.versionName == null) return false;
            String majorVersion = provider.versionName.split("\\.")[0];
            return Integer.parseInt(majorVersion) >= 100;
        } catch (RuntimeException error) {
            return false;
        }
    }

    private String webViewUpdateUrl() {
        try {
            PackageInfo provider = WebView.getCurrentWebViewPackage();
            if (provider != null && provider.packageName != null
                    && provider.packageName.toLowerCase(Locale.ROOT).contains("chrome")) {
                return "https://play.google.com/store/apps/details?id=com.android.chrome";
            }
        } catch (RuntimeException ignored) { }
        return WEBVIEW_UPDATE_URL;
    }

    private void handleBack() {
        if (backPending) return;
        if (webView == null) { finish(); return; }
        backPending = true;
        webView.evaluateJavascript(
                "(function(){try{if(typeof window.cocinaHandleBack==='function')"
                        + "return window.cocinaHandleBack()===true?'handled':'exit';"
                        + "return 'history';}catch(e){return 'history';}})()", result -> {
                    backPending = false;
                    if (destroyed || "\"handled\"".equals(result)) return;
                    if ("\"history\"".equals(result) && webView != null && webView.canGoBack()) {
                        webView.goBack();
                    } else finish();
                });
    }

    @Override
    public void onBackPressed() {
        handleBack();
    }

    private void showNativeError(int messageResource) {
        if (destroyed) return;
        releaseWebView();
        container.removeAllViews();
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setGravity(Gravity.CENTER);
        int padding = Math.round(28 * getResources().getDisplayMetrics().density);
        panel.setPadding(padding, padding, padding, padding);
        TextView heading = new TextView(this);
        heading.setText(R.string.error_title);
        heading.setTextSize(23);
        heading.setTextColor(Color.rgb(14, 81, 75));
        heading.setGravity(Gravity.CENTER);
        panel.addView(heading);
        TextView message = new TextView(this);
        message.setText(messageResource);
        message.setTextSize(17);
        message.setTextColor(Color.DKGRAY);
        message.setGravity(Gravity.CENTER);
        message.setPadding(0, padding, 0, padding);
        panel.addView(message);
        Button retry = new Button(this);
        retry.setText(R.string.retry);
        retry.setOnClickListener(view -> openRecipeScreen(ENTRY_URL));
        panel.addView(retry);
        Button update = new Button(this);
        update.setText(R.string.update_webview);
        update.setOnClickListener(view -> openExternal(Uri.parse(webViewUpdateUrl())));
        panel.addView(update);
        container.addView(panel, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    private void releaseWebView() {
        stopSpeech();
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (webView == null) return;
        WebView previous = webView;
        webView = null;
        container.removeView(previous);
        previous.stopLoading();
        previous.setWebChromeClient(null);
        previous.setWebViewClient(new WebViewClient());
        previous.destroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        if (webView != null && isLocalUrl(webView.getUrl())) state.putString("url", webView.getUrl());
        super.onSaveInstanceState(state);
    }

    @Override
    protected void onPause() {
        stopSpeech();
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onDestroy() {
        destroyed = true;
        pendingDocument = null;
        pendingSpeech = null;
        documents.shutdownNow();
        if (speech != null) { speech.stop(); speech.shutdown(); speech = null; }
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        releaseWebView();
        super.onDestroy();
    }

    private static final class Request {
        final String id;
        final JavaScriptReplyProxy proxy;
        Request(String id, JavaScriptReplyProxy proxy) { this.id = id; this.proxy = proxy; }
    }

    private static final class DocumentRequest {
        final Request request;
        final byte[] bytes;
        final String filename;
        DocumentRequest(Request request, byte[] bytes, String filename) {
            this.request = request; this.bytes = bytes; this.filename = filename;
        }
    }

    private static final class SpeechRequest {
        final Request request;
        final String text;
        final Locale locale;
        SpeechRequest(Request request, String text, Locale locale) {
            this.request = request; this.text = text; this.locale = locale;
        }
    }
}
