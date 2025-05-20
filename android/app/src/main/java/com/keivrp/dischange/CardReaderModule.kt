package com.keivrp.dischange

import android.content.ComponentName
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import android.util.Log
import android.content.Context
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject
import cn.nexgo.smartconnect.ISmartconnectService
import cn.nexgo.smartconnect.listener.ITransactionResultListener
import cn.nexgo.smartconnect.model.TransactionRequestEntity
import cn.nexgo.smartconnect.model.TransactionResultEntity
import com.google.gson.Gson

class CardReaderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val TAG = "CardReaderModule"
    private var iSmartconnectService: ISmartconnectService? = null
    private var isServiceBound = false

    init {
        Log.d(TAG, "Iniciando módulo de lector de tarjetas Nexgo...")
        bindSmartconnectService()
    }

    override fun getName(): String {
        return "CardReaderModule"
    }

    private fun bindSmartconnectService() {
        try {
            Log.d(TAG, "Iniciando vinculación con servicio Smartconnect...")
            val intent = Intent()
            intent.component = ComponentName("cn.nexgo.veslc", "cn.nexgo.inbas.smartconnect.SmartConnectService")
            reactApplicationContext.bindService(intent, mConnection, Context.BIND_AUTO_CREATE)
        } catch (e: Exception) {
            Log.e(TAG, "Error al vincular servicio Smartconnect", e)
            sendEvent("cardReaderError", "Error al vincular servicio: ${e.message}")
        }
    }

    private val mConnection = object : ServiceConnection {
        override fun onServiceConnected(componentName: ComponentName, iBinder: IBinder) {
            Log.d(TAG, "Servicio Smartconnect conectado")
            iSmartconnectService = ISmartconnectService.Stub.asInterface(iBinder)
            isServiceBound = true
            sendEvent("cardReaderStatus", "Servicio conectado exitosamente")
        }

        override fun onServiceDisconnected(componentName: ComponentName) {
            Log.d(TAG, "Servicio Smartconnect desconectado")
            iSmartconnectService = null
            isServiceBound = false
            sendEvent("cardReaderStatus", "Servicio desconectado")
        }
    }

    @ReactMethod
    fun isServiceConnected(promise: Promise) {
        promise.resolve(isServiceBound)
    }

    @ReactMethod
    fun connectService(promise: Promise) {
        try {
            if (isServiceBound) {
                Log.d(TAG, "El servicio ya está conectado")
                promise.resolve(true)
                return
            }
            
            bindSmartconnectService()
            
            // Verificamos si la conexión fue exitosa después de un breve retraso
            reactApplicationContext.runOnUiQueueThread {
                promise.resolve(isServiceBound)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error al conectar servicio", e)
            promise.reject("CONNECTION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun doTransaction(transactionDetails: ReadableMap, promise: Promise) {
        try {
            if (!isServiceBound || iSmartconnectService == null) {
                Log.e(TAG, "doTransaction llamado pero el servicio no está vinculado")
                promise.reject("SERVICE_NOT_BOUND", "El servicio de Nexgo no está conectado o listo.")
                return
            }

            // Convertir ReadableMap a JSON
            val jsonString = convertMapToJson(transactionDetails)
            Log.d(TAG, "doTransaction llamado con: $jsonString")

            // Crear entidad de transacción
            val json = JSONObject(jsonString)
            val entity = TransactionRequestEntity()
            
            // Establecer propiedades de la entidad
            entity.amount = json.optString("amount")
            entity.cardHolderId = json.optString("documentNumber")
            entity.waiterNumber = json.optString("waiterNum")
            entity.referenceNumber = json.optString("referenceNo")
            entity.transacitonType = json.optInt("transType")

            Log.d(TAG, "Entidad de transacción creada: $entity")
            // Solicitar transacción
            iSmartconnectService!!.transactionRequest(entity, object : ITransactionResultListener.Stub() {
                override fun onTransactionResult(transactionResultEntity: TransactionResultEntity) {
                    val gson = Gson()
                    val jsonResult = gson.toJson(transactionResultEntity)
                    val resultCode = transactionResultEntity.result
                    val errorCode = transactionResultEntity.errorCode
                    val responseMsg = transactionResultEntity.responseMessage
                    
                    Log.i(TAG, "Resultado transacción: $jsonResult")
                    
                    if (resultCode == 0) {
                        // Crear un WritableMap a partir del resultado para devolver a React Native
                        val resultMap = Arguments.createMap()
                        resultMap.putString("responseCode", transactionResultEntity.responseCode)
                        //resultMap.putString("authCode", transactionResultEntity.authCode)
                        //resultMap.putString("rrn", transactionResultEntity.rrn)
                        //resultMap.putString("cardNo", transactionResultEntity.cardNo)
                        resultMap.putString("responseMessage", transactionResultEntity.responseMessage)
                        
                        // Resolver la promesa con el resultado exitoso
                        reactApplicationContext.runOnUiQueueThread {
                            promise.resolve(resultMap)
                        }
                    } else {
                        Log.e(TAG, "ERROR: resultCode=$resultCode, errorCode=$errorCode, responseMessage=$responseMsg")
                        val isCancelled = errorCode == -2 || responseMsg.equals("CANCELLED", ignoreCase = true)
                        val message = if (isCancelled) "Transacción cancelada por el usuario" else "Transacción fallida"
                        
                        // Rechazar la promesa con el error
                        reactApplicationContext.runOnUiQueueThread {
                            promise.reject("TRANS_FAILED", message, Exception(jsonResult))
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "Error en doTransaction", e)
            promise.reject("EXCEPTION", e.message)
        }
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        try {
            if (isServiceBound) {
                Log.d(TAG, "Desconectando servicio Smartconnect...")
                reactApplicationContext.unbindService(mConnection)
                isServiceBound = false
                iSmartconnectService = null
                Log.d(TAG, "Servicio desconectado")
            }
            promise.resolve("Servicio desconectado exitosamente")
        } catch (e: Exception) {
            Log.e(TAG, "Error al desconectar servicio", e)
            promise.reject("DISCONNECT_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            // Crear instancia de NexgoService para obtener info del dispositivo
            val nexgoService = NexgoService(reactApplicationContext.applicationContext as android.app.Application)
            val serial = nexgoService.getSN()
            
            val deviceInfo = Arguments.createMap()
            deviceInfo.putString("serial", serial)
            
            promise.resolve(deviceInfo)
        } catch (e: Exception) {
            Log.e(TAG, "Error al obtener información del dispositivo", e)
            promise.reject("DEVICE_INFO_ERROR", e.message)
        }
    }

    private fun convertMapToJson(readableMap: ReadableMap): String {
        val jsonObject = JSONObject()
        val iterator = readableMap.keySetIterator()
        
        while (iterator.hasNextKey()) {
            val key = iterator.nextKey()
            when (readableMap.getType(key)) {
                ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
                ReadableType.Boolean -> jsonObject.put(key, readableMap.getBoolean(key))
                ReadableType.Number -> jsonObject.put(key, readableMap.getDouble(key))
                ReadableType.String -> jsonObject.put(key, readableMap.getString(key))
                ReadableType.Map -> {
                    val childMap = readableMap.getMap(key)
                    if (childMap != null) {
                        jsonObject.put(key, JSONObject(convertMapToJson(childMap)))
                    }
                }
                ReadableType.Array -> {
                    // Handle array if needed
                }
            }
        }
        
        return jsonObject.toString()
    }

    private fun sendEvent(eventName: String, params: String) {
        try {
            Log.d(TAG, "Sending event: $eventName with params: $params")
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
            Log.d(TAG, "Event sent successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error sending event $eventName", e)
            e.printStackTrace()
        }
    }
}