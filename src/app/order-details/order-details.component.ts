import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Order } from '../models/order.model';
import { Store } from '@ngrx/store';
import { AppState, getAccount, getAllOrders, getProducts} from '../state/app.reducer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GomangoUser } from '../modules/auth/user.model';
import { Media } from '../modules/media/media';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { getCurrentUser, UserState } from '../modules/auth/state/user.reducer';
import { getMedia, MediaState } from '../modules/media/state/media.reducer';
import { ActivatedRoute } from '@angular/router';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order;
  orderId: string;
  pdfDownloadModal: BsModalRef;
  subTotal: number;
  tax: number;
  grandTotal: number;
  products: Product[];
  user: GomangoUser;
  account: Account;
  media: Media[];
  // @ViewChild('content', { static: true }) content: ElementRef;
  date = new Date();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private modalService: BsModalService,
    private userStore: Store<UserState>,
    private mediaStore: Store<MediaState>,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // console.log(params);
      this.orderId = params['orderId'];
    });

    this.userStore.select(getCurrentUser).pipe().subscribe(user => this.user = user.user);

    this.store.select(getAccount).pipe().subscribe(account => this.account = account);

    this.store.select(getProducts).pipe().subscribe((products) => this.products = products);

    this.mediaStore.select(getMedia).pipe().subscribe((media) => {
      this.media = media;
      if (this.order && this.products && this.products.length) {
        this.mapProductAndMedia();
      }
    });

    this.store.select(getAllOrders).pipe().subscribe((orders) => {
      const filtered = orders.filter(order => order.id === this.orderId && order.status !== 'pending');
      this.order = filtered && filtered.length ? filtered[0] : null;
      console.log(`order selected : ${JSON.stringify(this.order)}`);
      if (this.order && this.media && this.media.length && this.products && this.products.length) {
        this.mapProductAndMedia();
      }
    });
  }

  mapProductAndMedia(): void {
    let items = this.order.items;
    let stateFromRemote = false;
    items = items.map(lineitem => {
      // if product exists cart was updated locally and we do not need to map products and media
      const item = {...lineitem };
      if (item.product) {
        return item;
      }
      const filtered = this.products.filter(product => product.id === item.productId);
      if (filtered.length) {
        item.product = {...filtered[0]};
        stateFromRemote = true;
        const filteredMedia = this.media.filter(media => media.tags.includes(item.productId));
        if (filteredMedia.length) {
          item.product.image = `${environment.BASE_API_ENDPOINT}/media/${environment.orgId}/media-container/${filteredMedia[0].url}`;
        }
      }
      return item;
    });
    this.order = {...this.order, items};
    if (stateFromRemote) {
      this.calculation();
    }
  }

  openPDFDownloadModal(pdfDownloadModal: TemplateRef<any>): void {
    this.pdfDownloadModal = this.modalService.show(pdfDownloadModal, Object.assign({}, { class: 'modal-medium' }));
    // this.geneRatePdf();
  }

  closePDFDownloadModal(): void {
    this.pdfDownloadModal.hide();
  }

  calculation(): void {
    this.subTotal = 0;
    this.order.items.forEach(element => {
      this.subTotal = (element.quantity * element.priceAtSubmission) + this.subTotal;
    });
    this.tax = this.subTotal * 10 / 100;
    this.grandTotal = this.subTotal + this.tax;
  }

  SavePDF(): void {
    const element = document.getElementById('pdfnew');
    console.log('here >>>', element);
    html2canvas(element).then(canvas => {
      console.log('Canvas' , canvas);
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      console.log('width' , pdfWidth);
      const pdfHeight = pdf.internal.pageSize.getHeight();
      console.log('height' , pdfHeight);
      pdf.addImage(imgData, 0, 0, pdfWidth, pdfHeight);
      pdf.save('new.pdf');
    });
  }

  geneRatePdf(): void {
    const element = document.getElementById('pdfnew');
    console.log('content', element);
    html2canvas(element, {scrollX: 0, scrollY: 0, scale: 1}).then( (canvas) => {
      console.log('Canvas' , canvas);
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF
      const imgWidth = 300;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('invoice.pdf');
      // window.open(doc.output('bloburl', { filename: 'new-file.pdf' }), '_blank');
    });
  }

}
