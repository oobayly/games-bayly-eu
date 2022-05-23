import { Injectable, Type } from "@angular/core";
import { NgbModal, NgbModalConfig, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

export interface BaseModal<T> {
  value: T;
}

export interface ModalOptions<TModal extends BaseModal<TValue>, TValue> {
  type: Type<TModal>,
  callback?: (instance: TModal) => void,
  options?: NgbModalOptions,
}

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(
    config: NgbModalConfig,
    private ngbModal: NgbModal,
  ) {
    config.centered = true;
    config.size = "lg";
  }

  public async showModal<TModal extends BaseModal<TValue>, TValue>(
    { type, callback, options }: ModalOptions<TModal, TValue>,
  ): Promise<TValue | undefined> {
    const ref = this.ngbModal.open(type, options);
    const instance = ref.componentInstance as TModal;

    if (callback) {
      callback(instance);
    }

    try {
      await ref.result;

      return instance.value;
    } catch {
      return undefined;
    }
  }
}
