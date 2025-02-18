// table.ts
type GradientType = "linear" | "radial";
type Direction = `to ${string}` | `${number}deg`;

interface VignetteOptions {
  enabled?: boolean;
  center?: string;
  size?: string;
  color?: string;
}

interface TableOptions {
  tileImage?: string; // ex: /images/black-felt.png
  overlayStartColor?: string;
  overlayEndColor?: string;
  overlayGradientType?: GradientType;
  overlayDirection?: Direction;
  overlayCenter?: string;
  overlaySize?: string;
  vignette?: VignetteOptions;
  backgroundColor?: string;
}

export interface TableSettings
  extends Required<Omit<TableOptions, "vignette">> {
  vignette: Required<VignetteOptions>;
}

export class Table {
  private options: TableSettings;
  private appElement: HTMLElement;

  constructor(element: HTMLElement, options: TableOptions = {}) {
    this.options = {
      tileImage: options.tileImage ?? "/images/45-degree-fabric-light.png",
      overlayStartColor: options.overlayStartColor ?? "rgba(0, 100, 0, 0.6)",
      overlayEndColor: options.overlayEndColor ?? "rgba(0, 60, 0, 0.8)",
      overlayGradientType: options.overlayGradientType ?? "linear",
      overlayDirection: options.overlayDirection ?? "to bottom",
      overlayCenter: options.overlayCenter ?? "center",
      overlaySize: options.overlaySize ?? "100%",
      vignette: {
        enabled: options.vignette?.enabled ?? true,
        center: options.vignette?.center ?? "center",
        size: options.vignette?.size ?? "80%",
        color: options.vignette?.color ?? "rgba(0, 0, 0, 0.4)",
      },
      backgroundColor: options.backgroundColor ?? "#1a472a",
    };
    this.appElement = element;
  }

  public setBackground(): void {
    this.appElement.style.backgroundColor = this.options.backgroundColor;

    const backgroundImages = [];
    const backgroundSizes = [];
    const backgroundRepeats = [];
    const backgroundPositions = [];
    const backgroundAttachments = [];

    // Add texture if path exists
    if (this.options.tileImage) {
      backgroundImages.push(`url("${this.options.tileImage}")`);
      backgroundSizes.push("auto");
      backgroundRepeats.push("repeat");
      backgroundPositions.push("center");
      backgroundAttachments.push("fixed"); // Make texture stay fixed
    }

    // Add overlay gradient with simpler syntax
    const overlayGradient = this.createOverlayGradient();
    if (overlayGradient) {
      backgroundImages.push(overlayGradient);
      backgroundSizes.push("cover");
      backgroundRepeats.push("no-repeat");
      backgroundPositions.push("center");
      backgroundAttachments.push("scroll");
    }

    // Add vignette with simpler syntax
    if (this.options.vignette.enabled) {
      const vignetteGradient = this.createVignetteGradient();
      if (vignetteGradient) {
        backgroundImages.push(vignetteGradient);
        backgroundSizes.push("cover");
        backgroundRepeats.push("no-repeat");
        backgroundPositions.push("center");
        backgroundAttachments.push("scroll");
      }
    }

    // Apply all background properties
    this.appElement.style.backgroundImage = backgroundImages.join(", ");
    this.appElement.style.backgroundSize = backgroundSizes.join(", ");
    this.appElement.style.backgroundRepeat = backgroundRepeats.join(", ");
    this.appElement.style.backgroundPosition = backgroundPositions.join(", ");
    this.appElement.style.backgroundAttachment =
      backgroundAttachments.join(", ");
  }

  private createOverlayGradient(): string {
    if (this.options.overlayGradientType === "radial") {
      return `radial-gradient(circle, ${this.options.overlayStartColor}, ${this.options.overlayEndColor})`;
    }
    return `linear-gradient(${this.options.overlayDirection}, ${this.options.overlayStartColor}, ${this.options.overlayEndColor})`;
  }

  private createVignetteGradient(): string {
    // Simplified vignette gradient
    return `radial-gradient(circle, transparent 40%, ${this.options.vignette.color})`;
  }

  public updateBackground(newOptions: Partial<TableOptions>): void {
    this.options = {
      ...this.options,
      ...newOptions,
      vignette: {
        ...this.options.vignette,
        ...newOptions.vignette,
      },
    };
    this.setBackground();
  }

  public getBackgroundSettings(): TableSettings {
    return { ...this.options };
  }
}
