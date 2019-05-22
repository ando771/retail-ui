package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'ReactUI_CreeveyTests'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("ReactUI_CreeveyTests")) {
    check(name == "Creevey test") {
        "Unexpected name: '$name'"
    }
    name = "Creevey tests"
}
