export interface Coordinate {
  x: number;
  y: number ;
}

export interface Dimensions {
  width: number;
  height: number
}

export interface ClassInteractionListener {
  onClassClick(classId: string): void;
  onClassHover(classId: string, coordinate: Coordinate): void;
  onPropertyHover(classId: string, propertyId: string, coordinate: Coordinate): void;
  onHoverExit(): void;
  onClassContextMenu(classId: string, coordinate: Coordinate): void;
  onDismissContextMenu(): void;
}
