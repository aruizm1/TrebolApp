/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ProductListComponent } from 'app/entities/product-list/product-list.component';
import { ProductListService } from 'app/entities/product-list/product-list.service';
import { ProductList } from 'app/shared/model/product-list.model';

describe('Component Tests', () => {
    describe('ProductList Management Component', () => {
        let comp: ProductListComponent;
        let fixture: ComponentFixture<ProductListComponent>;
        let service: ProductListService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductListComponent],
                providers: []
            })
                .overrideTemplate(ProductListComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductListComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductListService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ProductList(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.productLists[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
