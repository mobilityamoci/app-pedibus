import { Injectable } from '@angular/core';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

@Injectable({
  providedIn: 'root'
})
export class QrFromDeviceService {
  private codeReader: BrowserMultiFormatReader;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  async scanImage(imageUrl: string): Promise<string | null> {
    try {
      console.log('Starting to scan image:', imageUrl);
      const result = await this.codeReader.decodeFromImageUrl(imageUrl);
      console.log('QR code scanned successfully:', result);
      return result.getText();
    } catch (e) {
      if (e instanceof NotFoundException) {
        console.error('QR code not found in the image.');
        return null;
      } else {
        console.error('Error scanning QR code:', e);
        return null;  // Возвращаем null, чтобы обработать ошибку в вызывающем коде
      }
    }
  }
}
