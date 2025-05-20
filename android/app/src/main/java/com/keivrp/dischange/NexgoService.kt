package com.keivrp.dischange

import android.app.Application
import android.util.Log
import com.nexgo.oaf.apiv3.APIProxy
import com.nexgo.oaf.apiv3.DeviceEngine
import com.nexgo.oaf.apiv3.DeviceInfo

class NexgoService(application: Application) {
    private val TAG = "NexgoService"
    private var deviceEngine: DeviceEngine? = null
    private var deviceInfo: DeviceInfo? = null

    init {
        try {
            Log.d(TAG, "Initializing Nexgo Service...")
            deviceEngine = APIProxy.getDeviceEngine(application)
            deviceInfo = deviceEngine?.deviceInfo
            Log.d(TAG, "Nexgo Service initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing Nexgo Service", e)
            e.printStackTrace()
        }
    }

    fun getSN(): String {
        return try {
            deviceInfo?.sn ?: "Unknown"
        } catch (e: Exception) {
            Log.e(TAG, "Error getting serial number", e)
            "Error: ${e.message}"
        }
    }

    fun getModel(): String {
        return try {
            deviceInfo?.model ?: "Unknown"
        } catch (e: Exception) {
            Log.e(TAG, "Error getting model", e)
            "Error: ${e.message}"
        }
    }

    fun getFirmwareVersion(): String {
        return try {
            //deviceInfo?.firmwareVersion ?:
             "Unknown"
        } catch (e: Exception) {
            Log.e(TAG, "Error getting firmware version", e)
            "Error: ${e.message}"
        }
    }
}