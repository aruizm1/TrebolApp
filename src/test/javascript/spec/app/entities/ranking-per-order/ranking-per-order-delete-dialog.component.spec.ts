/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { RankingPerOrderDeleteDialogComponent } from 'app/entities/ranking-per-order/ranking-per-order-delete-dialog.component';
import { RankingPerOrderService } from 'app/entities/ranking-per-order/ranking-per-order.service';

describe('Component Tests', () => {
    describe('RankingPerOrder Management Delete Component', () => {
        let comp: RankingPerOrderDeleteDialogComponent;
        let fixture: ComponentFixture<RankingPerOrderDeleteDialogComponent>;
        let service: RankingPerOrderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [RankingPerOrderDeleteDialogComponent]
            })
                .overrideTemplate(RankingPerOrderDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(RankingPerOrderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RankingPerOrderService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
