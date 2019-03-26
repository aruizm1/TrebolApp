import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductList, ProductList } from 'app/shared/model/product-list.model';
import { AccountService } from 'app/core';
import { ProductListService } from './product-list.service';
import { Ilistpurchaseall, ListPurchaseAll } from 'app/shared/model/listpurchaseall.model';
import { ListPurchaseService } from 'app/entities/list-purchase';
import { IListPurchase, ListPurchase } from 'app/shared/model/list-purchase.model';

@Component({
    selector: 'jhi-product-list',
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
    productList: IProductList;
    productLists: IProductList[];
    currentAccount: any;
    eventSubscriber: Subscription;
    list: IListPurchase;

    productListarray: ProductList[];
    listpurchaseall: Ilistpurchaseall;
    listpurchaseallArray: Ilistpurchaseall[];

    constructor(
        protected productListService: ProductListService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected listPurchaseService: ListPurchaseService
    ) {}

    loadAllPurchase() {
        this.listpurchaseallArray = [];
        this.productListarray = [];

        this.listPurchaseService
            .query()
            .pipe(
                filter((res: HttpResponse<IListPurchase[]>) => res.ok),
                map((res: HttpResponse<IListPurchase[]>) => res.body)
            )
            .subscribe(
                (res: IListPurchase[]) => {
                    for (const purchase of res) {
                        this.listpurchaseall = new ListPurchaseAll(new ListPurchase(), []);
                        for (const product of this.productLists) {
                            if (purchase.id === product.idlistpurchase) {
                                this.listpurchaseall.productlist.push(product);
                            }
                        }
                        this.listpurchaseall.listpurchase = purchase;
                        this.listpurchaseallArray.push(this.listpurchaseall);
                    }
                    console.log('lista de compras');
                    console.log(this.listpurchaseallArray);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadAll() {
        this.productListService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductList[]>) => res.ok),
                map((res: HttpResponse<IProductList[]>) => res.body)
            )
            .subscribe(
                (res: IProductList[]) => {
                    this.productLists = res;
                    this.loadAllPurchase();
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProductLists();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductList) {
        return item.id;
    }

    registerChangeInProductLists() {
        this.eventSubscriber = this.eventManager.subscribe('productListListModification', response => this.loadAll());
    }

    registerChangeInListPurchases() {
        this.eventSubscriber = this.eventManager.subscribe('listPurchaseListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
