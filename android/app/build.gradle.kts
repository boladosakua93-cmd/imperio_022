import java.util.Properties

plugins {
    id("com.android.application")
    id("dev.flutter.flutter-gradle-plugin")
}

// Lê configurações de assinatura do arquivo key.properties (não commitado)
val keyProperties = Properties()
val keyPropertiesFile = rootProject.file("key.properties")
if (keyPropertiesFile.exists()) {
    keyPropertiesFile.inputStream().use { keyProperties.load(it) }
}

android {
    namespace = "com.example.imperio_022"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    signingConfigs {
        create("release") {
            if (keyPropertiesFile.exists()) {
                keyAlias        = keyProperties["keyAlias"]        as String
                keyPassword     = keyProperties["keyPassword"]     as String
                storeFile       = file(keyProperties["storeFile"]  as String)
                storePassword   = keyProperties["storePassword"]   as String
            }
        }
    }

    defaultConfig {
        // TODO: troque pelo Application ID definitivo antes de publicar na Play Store
        applicationId = "com.imperio022.app"
        minSdk        = flutter.minSdkVersion
        targetSdk     = flutter.targetSdkVersion
        versionCode   = flutter.versionCode
        versionName   = flutter.versionName
    }

    buildTypes {
        release {
            // Usa a assinatura de release se key.properties existir; caso contrário, usa debug
            signingConfig = if (keyPropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            isMinifyEnabled   = false
            isShrinkResources = false
        }
    }
}

flutter {
    source = "../.."
}
