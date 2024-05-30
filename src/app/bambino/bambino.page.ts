import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../data-transfer.service';

@Component({
  selector: 'app-bambino',
  templateUrl: './bambino.page.html',
  styleUrls: ['./bambino.page.scss'],
})
export class BambinoPage implements OnInit {
  qrData: any

  constructor(private route: ActivatedRoute, private dataTransferService: DataTransferService) { }

  ngOnInit() {
    this.qrData = this.dataTransferService.getData()
  }
}
