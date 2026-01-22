import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalData {
  title: string;
  message: string;
  type: ModalType;
  confirmText?: string;
  cancelText?: string;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalData | null>(null);
  public modal$ = this.modalSubject.asObservable();

  /**
   * Show an alert-style modal
   */
  showAlert(message: string, title: string = 'แจ้งเตือน', type: ModalType = 'info'): Promise<boolean> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        title,
        message,
        type,
        confirmText: 'ตกลง',
        resolve
      });
    });
  }

  /**
   * Show a confirmation-style modal
   */
  showConfirm(message: string, title: string = 'ยืนยัน', confirmText: string = 'ตกลง', cancelText: string = 'ยกเลิก'): Promise<boolean> {
    return new Promise((resolve) => {
      this.modalSubject.next({
        title,
        message,
        type: 'confirm',
        confirmText,
        cancelText,
        resolve
      });
    });
  }

  /**
   * Success shortcut
   */
  success(message: string, title: string = 'สำเร็จ'): Promise<boolean> {
    return this.showAlert(message, title, 'success');
  }

  /**
   * Error shortcut
   */
  error(message: string, title: string = 'เกิดข้อผิดพลาด'): Promise<boolean> {
    return this.showAlert(message, title, 'error');
  }

  /**
   * Close the modal and resolve the promise
   */
  close(result: boolean): void {
    const current = this.modalSubject.value;
    if (current && current.resolve) {
      current.resolve(result);
    }
    this.modalSubject.next(null);
  }
}
