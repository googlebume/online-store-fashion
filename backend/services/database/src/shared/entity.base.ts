export abstract class Entity<Id, Props> {
  constructor(readonly id: Id, protected readonly props: Props) {}

  equals(other: Entity<Id, Props>): boolean {
    return this.id === other.id;
  }

  protected updateProps<K extends keyof Props>(key: K, value: Props[K]): Props {
    return { ...this.props, [key]: value };
  }
}
