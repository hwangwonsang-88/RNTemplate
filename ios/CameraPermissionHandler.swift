//
//  CameraPermissionManager.swift
//  RNTemplate
//
//  Created by 인스웨이브 on 9/5/25.
//

import Foundation
import AVFoundation
import React

@objc(CameraPermissionHandler)
class CameraPermissionHandler: NSObject {
    
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func checkCameraPermission(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let status = AVCaptureDevice.authorizationStatus(for: .video)
        
      switch status {
      case .authorized:
        resolve(true)
      default:
        resolve(false)
      }
    }
  }
  
  @objc
  func requestCameraPermission(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      AVCaptureDevice.requestAccess(for: .video) { granted in
        resolve(granted)
      }
    }
  }
}
