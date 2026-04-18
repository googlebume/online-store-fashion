import { Result, ok, fail } from '../../../shared/result';
import { InvalidDeliveryMethodException } from '../exceptions/order.exceptions';

export enum DeliveryMethodEnum {
  COURIER = 'Courier',
  PICKUP = 'Pickup',
}

export class DeliveryMethod {
  private constructor(readonly value: DeliveryMethodEnum) {}

  static create(raw: string): Result<DeliveryMethod, InvalidDeliveryMethodException> {
    const normalized = [
      { input: ["Кур'єр", 'Courier', 'courier', 'Нова пошта', 'nova poshta'], output: DeliveryMethodEnum.COURIER },
      { input: ['Самовивіз', 'Pickup', 'pickup'], output: DeliveryMethodEnum.PICKUP },
    ].find(m => m.input.some(i => i.toLowerCase() === raw?.toLowerCase().trim()));

    if (!normalized) {
      return fail(new InvalidDeliveryMethodException(raw));
    }

    return ok(new DeliveryMethod(normalized.output));
  }

  static courier(): DeliveryMethod {
    return new DeliveryMethod(DeliveryMethodEnum.COURIER);
  }

  static pickup(): DeliveryMethod {
    return new DeliveryMethod(DeliveryMethodEnum.PICKUP);
  }

  equals(other: DeliveryMethod): boolean {
    return this.value === other.value;
  }

  isCourier(): boolean {
    return this.value === DeliveryMethodEnum.COURIER;
  }

  isPickup(): boolean {
    return this.value === DeliveryMethodEnum.PICKUP;
  }

  toString(): string {
    return this.value;
  }
}
