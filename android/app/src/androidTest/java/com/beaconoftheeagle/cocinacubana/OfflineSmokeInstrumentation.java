package com.beaconoftheeagle.cocinacubana;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** One bounded smoke test of the isolated debug package; no UI input or external services. */
public final class OfflineSmokeInstrumentation extends Instrumentation {
    private static final int EXPECTED_RECIPES = 1041;
    private static final String TEST_NAME = "offlineCatalogAndAndroidBridge";
    private Activity activity;

    @Override
    public void onCreate(Bundle arguments) {
        super.onCreate(arguments);
        start();
    }

    @Override
    public void onStart() {
        Bundle status = new Bundle();
        status.putString("class", getClass().getName());
        status.putString("test", TEST_NAME);
        status.putInt("current", 1);
        status.putInt("numtests", 1);
        sendStatus(1, status);
        Bundle result = new Bundle();
        try {
            verifyPackageAndAssets();
            JSONObject screen = verifyStartup();
            status.putString("stream", ".");
            sendStatus(0, status);
            result.putString("stream", "\nOK (1 test)\n");
            result.putString("checks", "debug isolation; no requested permissions; backup disabled; "
                    + "1041 Spanish recipes; 1041 English recipes; 1041 local images; "
                    + "local startup; native bridge; image decoded; no remote resource entries");
            result.putString("screen", screen.toString());
            closeActivity();
            finish(Activity.RESULT_OK, result);
        } catch (Throwable error) {
            String detail = error.getClass().getSimpleName() + ": " + error.getMessage();
            status.putString("stack", detail);
            status.putString("stream", "\nFAIL: " + detail + "\n");
            sendStatus(-2, status);
            result.putString("stream", "\nFAILURES!!!\n" + detail + "\n");
            closeActivity();
            finish(Activity.RESULT_CANCELED, result);
        }
    }

    private void verifyPackageAndAssets() throws Exception {
        String target = getTargetContext().getPackageName();
        require("com.beaconoftheeagle.cocinacubana.debug".equals(target),
                "The smoke test is restricted to the isolated .debug package.");
        PackageInfo info = getTargetContext().getPackageManager().getPackageInfo(
                target, PackageManager.GET_PERMISSIONS);
        require(info.requestedPermissions == null || info.requestedPermissions.length == 0,
                "The application must not request INTERNET, storage or other permissions.");
        require((info.applicationInfo.flags & ApplicationInfo.FLAG_ALLOW_BACKUP) == 0,
                "Automatic application backup must remain disabled.");
        require(info.applicationInfo.targetSdkVersion == 36, "The Android target must be API 36.");

        JSONArray spanish = new JSONArray(readAsset("recipes.json"));
        JSONArray english = new JSONArray(readAsset("recipes.en.json"));
        JSONObject illustrations = new JSONObject(readAsset("recipe-images.json"));
        require(spanish.length() == EXPECTED_RECIPES, "Unexpected Spanish catalog size.");
        require(english.length() == EXPECTED_RECIPES, "Unexpected English catalog size.");
        require(illustrations.length() == EXPECTED_RECIPES, "Unexpected image manifest size.");
        Set<String> englishIds = new HashSet<>();
        for (int index = 0; index < english.length(); index++) {
            englishIds.add(english.getJSONObject(index).getString("id"));
        }
        require(englishIds.size() == EXPECTED_RECIPES, "English recipe IDs must be unique.");
        Set<String> packagedImages = new HashSet<>();
        String[] assets = getTargetContext().getAssets().list("assets/recipes");
        if (assets != null) for (String asset : assets) {
            if (asset.endsWith(".webp")) packagedImages.add(asset);
        }
        require(packagedImages.size() == EXPECTED_RECIPES, "The complete image collection must be bundled.");
        Set<String> spanishIds = new HashSet<>();
        for (int index = 0; index < spanish.length(); index++) {
            JSONObject recipe = spanish.getJSONObject(index);
            String id = recipe.getString("id");
            require(spanishIds.add(id) && englishIds.contains(id), "A recipe ID is duplicated or untranslated.");
            JSONObject image = illustrations.getJSONObject(id);
            require(("assets/recipes/" + id + "-3d.webp").equals(image.getString("src")),
                    "An image path is not its expected local asset.");
            require(packagedImages.contains(id + "-3d.webp"), "A recipe image is missing from the APK.");
        }
    }

    private JSONObject verifyStartup() throws Exception {
        Intent launch = new Intent();
        launch.setClassName(getTargetContext().getPackageName(), MainActivity.class.getName());
        launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        activity = startActivitySync(launch);
        waitForIdleSync();
        AtomicReference<WebView> found = new AtomicReference<>();
        runOnMainSync(() -> found.set(findWebView(activity.getWindow().getDecorView())));
        WebView web = found.get();
        require(web != null, "No WebView: check the installed Android System WebView version.");
        String script = "JSON.stringify((function(){"
                + "const image=document.querySelector('img[src*=\"assets/\"]');"
                + "return {title:document.title,href:location.href,"
                + "count:typeof recipes!=='undefined'?recipes.length:0,"
                + "bridge:typeof window.CocinaNative!=='undefined',"
                + "adapter:!!(window.CocinaAndroid&&window.CocinaAndroid.active),"
                + "imageLoaded:!!(image&&image.complete&&image.naturalWidth>0),"
                + "remoteResources:performance.getEntriesByType('resource').map(x=>x.name)"
                + ".filter(x=>!x.startsWith(location.origin+'/assets/')&&!x.startsWith('data:')&&!x.startsWith('blob:'))};"
                + "})())";
        long deadline = SystemClock.elapsedRealtime() + 25_000;
        JSONObject screen = null;
        while (SystemClock.elapsedRealtime() < deadline) {
            screen = evaluate(web, script);
            if (screen.optInt("count") == EXPECTED_RECIPES && screen.optBoolean("imageLoaded")) break;
            SystemClock.sleep(200);
        }
        require(screen != null && screen.optInt("count") == EXPECTED_RECIPES,
                "The packaged recipe catalog did not reach the DOM.");
        require(screen.optString("title").startsWith("Cocina Cubana"), "Unexpected application title.");
        require(screen.optString("href").startsWith("https://appassets.androidplatform.net/assets/index.html"),
                "The application is not using its local HTTPS asset origin.");
        require(screen.optBoolean("bridge") && screen.optBoolean("adapter"),
                "The native bridge and web adapter must both be available.");
        require(screen.optBoolean("imageLoaded"), "A bundled recipe bitmap did not decode.");
        require(screen.getJSONArray("remoteResources").length() == 0,
                "Startup requested a remote resource.");
        return screen;
    }

    private JSONObject evaluate(WebView web, String script) throws Exception {
        CountDownLatch done = new CountDownLatch(1);
        AtomicReference<String> reply = new AtomicReference<>();
        runOnMainSync(() -> web.evaluateJavascript(script, value -> {
            reply.set(value);
            done.countDown();
        }));
        require(done.await(5, TimeUnit.SECONDS), "Timed out reading the application DOM.");
        Object decoded = new JSONTokener(reply.get()).nextValue();
        require(decoded instanceof String, "The DOM response was not a JSON string.");
        return new JSONObject((String) decoded);
    }

    private String readAsset(String name) throws Exception {
        try (InputStream input = getTargetContext().getAssets().open(name);
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int length;
            while ((length = input.read(buffer)) != -1) output.write(buffer, 0, length);
            return output.toString(StandardCharsets.UTF_8.name());
        }
    }

    private static WebView findWebView(View view) {
        if (view instanceof WebView) return (WebView) view;
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            for (int index = 0; index < group.getChildCount(); index++) {
                WebView child = findWebView(group.getChildAt(index));
                if (child != null) return child;
            }
        }
        return null;
    }

    private void closeActivity() {
        if (activity != null) runOnMainSync(activity::finish);
    }

    private static void require(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
