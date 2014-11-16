
package com.bystep;

import android.app.Activity;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.media.MediaPlayer.OnErrorListener;
import android.media.MediaPlayer.OnPreparedListener;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import jp.ne.docomo.smt.dev.common.exception.SdkException;
import jp.ne.docomo.smt.dev.common.exception.ServerException;
import jp.ne.docomo.smt.dev.common.http.AuthApiKey;
import jp.ne.docomo.smt.dev.dialogue.Dialogue;
import jp.ne.docomo.smt.dev.dialogue.data.DialogueResultData;
import jp.ne.docomo.smt.dev.dialogue.param.DialogueRequestParam;
import jp.ne.docomo.smt.dev.knowledge.KnowledgeSearch;
import jp.ne.docomo.smt.dev.knowledge.data.KnowledgeMessageData;
import jp.ne.docomo.smt.dev.knowledge.data.KnowledgeResultData;
import jp.ne.docomo.smt.dev.knowledge.param.KnowledgeRequestParam;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

public class MainActivity extends Activity {

    // Docomo Q&A API キー
    static final String APIKEY = "523637367a33684575667753674c58524e4f6436414a6f4d74716678426d4f30576343594f4a6c36587a35";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        Window win = getWindow();
        WindowManager.LayoutParams winParams = win.getAttributes();
        winParams.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
        winParams.flags |= 0x80000000;
        win.setAttributes(winParams);

        WebView webview = new WebView(this);
        setContentView(webview);

        webview.setWebViewClient(new WebViewClient() {
        });

        webview.loadUrl("http://bystep.azurewebsites.net/");

        new SpeechAsyncTask().execute(0);
    }

    private final class SpeechAsyncTask extends AsyncTask<Integer, Void, String> {

        @Override
        protected String doInBackground(final Integer... params) {
            Integer id = params[0];
            String textForSpeech = null;

            AuthApiKey.initializeAuth(APIKEY);

            KnowledgeResultData resultData = null;
            // 知識QA 要求処理クラスを作成
            KnowledgeSearch search = new KnowledgeSearch();

            // 知識QA 要求リクエストデータクラスを作成してパラメータをsetする
            KnowledgeRequestParam requestParam = new KnowledgeRequestParam();
            String cookingKeyword = "アクアパッツァ";
            requestParam.setQuestion(cookingKeyword + "の意味は何？");

            // 知識QA 要求処理クラスにリクエストデータを渡し、レスポンスデータを取得する
            try {
                resultData = search.request(requestParam);
                KnowledgeMessageData messageData = resultData.getMessage();

                textForSpeech = messageData.getTextForSpeech();

                // 雑談対話要求処理クラスを作成
                Dialogue dialogue = new Dialogue();
                // 雑談対話要求リクエストデータクラスを作成してパラメータをset する
                // context には任意の文字列を設定する。
                DialogueRequestParam param = new DialogueRequestParam();
                param.setUtt(cookingKeyword);
                // 雑談対話要求処理クラスにリクエストデータを渡し、レスポンスデータを取得する
                DialogueResultData dialogueResultData = null;
                try {
                    dialogueResultData = dialogue.request(param);
                } catch (SdkException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                } catch (ServerException e1) {
                    // TODO Auto-generated catch block
                    e1.printStackTrace();
                }
                // 対話を継続するために context には任意の文字列を設定する。
                // param.setUtt(mKanji);
                // param.setContext(resultData.getContext());
                // 雑談対話要求処理クラスにリクエストデータを渡し、レスポンスデータを取得する
                // resultData = dialogue.request(param);
                textForSpeech = textForSpeech + dialogueResultData.getYomi();

                // AndroidHttpClientを使ってみた (Android 2.2 Froyoから使えます)
                AndroidHttpClient client = AndroidHttpClient.newInstance("Android UserAgent");
                HttpPost httpPost = new HttpPost(
                        // "https://api.apigw.smt.docomo.ne.jp/virtualNarrator/v1/textToSpeech?APIKEY=372e75656d556152344450384678556c614c666a5844436136654e454874524a316a54684c712f536c4343");
                        "https://api.apigw.smt.docomo.ne.jp/virtualNarrator/v1/textToSpeech?APIKEY="
                                + APIKEY);
                httpPost.setHeader("Content-Type", "application/json");
                String postData = new String(
                        "{\"Command\":\"AP_Synth\", \"AudioFileFormat\":\"0\", \"TextData\":\""
                                + cookingKeyword + "。" + textForSpeech + "\"}");
                httpPost.setEntity(new StringEntity(postData, "UTF-8"));

                HttpResponse res = client.execute(httpPost);

                Header[] headerArray = res.getAllHeaders();
                for (Header header : headerArray) {
                    Log.v("TAG", header.getName() + ":" + header.getValue());
                }

                int status = res.getStatusLine().getStatusCode();

                if (status != HttpStatus.SC_OK) {
                    client.close();
                    return null;
                }

                InputStream is = res.getEntity().getContent();

                File cache = getCacheDir();

                String cacheSpeechFile = cache.getAbsolutePath() + "/speech.aac";
                File removeFile = new File(cacheSpeechFile);
                removeFile.deleteOnExit();

                File file = new File(cacheSpeechFile);

                createFileWithInputStream(is, file);
                client.close();

                try {
                    MediaPlayer player = new MediaPlayer();
                    // File speechFile = new File(cacheSpeechFile);
                    // FileInputStream stream = new
                    // FileInputStream(speechFile);
                    // FileDescriptor fd = stream.getFD();
                    player.setDataSource(cacheSpeechFile);
                    player.setOnPreparedListener(new OnPreparedListener() {
                        @Override
                        public void onPrepared(final MediaPlayer mp) {
                            mp.start();
                        }
                    });
                    player.setOnCompletionListener(new OnCompletionListener() {
                        @Override
                        public void onCompletion(final MediaPlayer mp) {
                            mp.reset();
                            // mp.release();
                        }
                    });
                    player.setOnErrorListener(new OnErrorListener() {
                        @Override
                        public boolean onError(final MediaPlayer mp, final int what,
                                final int extra) {
                            Log.e("TAG", mp.toString());
                            Log.e("TAG", String.valueOf(what) + ":" + String.valueOf(extra));

                            return true;
                        }
                    });

                    player.prepareAsync();
                } catch (IllegalArgumentException e) {
                    e.printStackTrace();
                } catch (IllegalStateException e) {
                    e.printStackTrace();
                } catch (SecurityException e) {
                    e.printStackTrace();
                }
            } catch (SdkException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            } catch (ServerException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            } catch (UnsupportedEncodingException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            } catch (IOException e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }

            return null;

        }
    }

    // InputStreamオブジェクトにあるデータをファイルに出力する
    static void createFileWithInputStream(final InputStream inputStream, final File destFile)
            throws IOException {

        byte[] buffer = new byte[1024];
        int length = 0;
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(destFile);

            while ((length = inputStream.read(buffer)) >= 0) {
                fos.write(buffer, 0, length);
            }
            fos.close();
            fos = null;
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
