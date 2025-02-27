package com.kno.app;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

public class HeadlessService extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "Headless",
          Arguments.fromBundle(extras),
          0, // timeout in milliseconds for the task
          true // optional: defines whether or not the task is allowed in foreground. Default is false
        );
    }
    return null;
  }
}