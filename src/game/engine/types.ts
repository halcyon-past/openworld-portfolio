export type Direction = 'down' | 'up' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  name: string;
  x: number; // in tile coordinates
  y: number;
  direction: Direction;
  spriteType: string;
  isMoving: boolean;
  dialogueId?: string;
  interactable: boolean;
}

export interface BuildingTrigger {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'pokedex' | 'gym' | 'mart' | 'lab' | 'arcade' | 'house' | 'sign' | 'football' | 'tv' | 'fountain' | 'bench';
  targetModal?: 'pokedex' | 'trainercard' | 'bag' | 'townmap' | 'arcade' | 'contact' | 'gymbattle' | 'dialogue';
  dialogueText?: string[];
}

export interface GameState {
  player: {
    x: number;
    y: number;
    subX: number; // sub-tile interpolation (0..1)
    subY: number;
    direction: Direction;
    isMoving: boolean;
    isSprinting: boolean;
    stepFrame: number;
    animTimer: number;
  };
  camera: {
    x: number;
    y: number;
  };
  football: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
  interactTarget: BuildingTrigger | Entity | null;
  activeModal: string | null;
  activeDialogue: {
    speaker: string;
    avatar?: string;
    lines: string[];
    onComplete?: () => void;
  } | null;
}
