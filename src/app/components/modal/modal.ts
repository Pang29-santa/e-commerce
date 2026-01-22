import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalData } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.css'],
  standalone: false
})
export class ModalComponent implements OnInit {
  modalData: ModalData | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe(data => {
      this.modalData = data;
    });
  }

  handleConfirm(): void {
    this.modalService.close(true);
  }

  handleCancel(): void {
    this.modalService.close(false);
  }

  getIcon(): string {
    switch (this.modalData?.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'confirm': return '❓';
      default: return 'ℹ️';
    }
  }
}
