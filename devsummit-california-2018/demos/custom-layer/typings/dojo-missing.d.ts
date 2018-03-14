declare namespace dojo {
  namespace promise {
    interface Promise<T> extends Thenable<T> {
      catch<U>(errback: PromiseErrback<U>): Promise<U>;
    }
  }
}

declare namespace dojox {
  namespace charting {
    namespace action2d {
      interface Tooltip {
      }

      interface TooltipConstructor {
        new (chart: Chart2D, plot?: any, kwArgs?: any): Tooltip;
      }
    }

    interface Theme {
    }

    interface ThemeConstructor {
      (kwArgs?: any): Theme;
    }

    interface Chart {
      addPlot(name: string, args?: any): this;

      addSeries(name: string, args?: any): this;

      addAxis(name: string, args?: any): this;

      setTheme<T extends ThemeConstructor>(theme: T): this;

      render(): this;
    }

    interface ChartConstructor {
      new (node: HTMLElement, params?: any): Chart;
    }

    interface Chart2D extends Chart {
    }

    interface Chart2DConstructor extends ChartConstructor {
      new (node: HTMLElement, params?: any): Chart2D;
    }
  }
}

declare namespace dstore {
  interface Csv {
    fieldNames: string[];
    delimiter: string;
    newline: string;

    parse(value: string): HashMap<any>[];
  }

  interface CsvConstructor {
    new (): Csv;
  }
}

declare module "dojox/charting/Chart2D" {
  type Chart2D = dojox.charting.Chart2D;
  const Chart2D: dojox.charting.Chart2DConstructor;
  export = Chart2D;
}

declare module "dojox/charting/action2d/Tooltip" {
  type Tooltip = dojox.charting.action2d.Tooltip;
  const Tooltip: dojox.charting.action2d.TooltipConstructor;
  export = Tooltip;
}

declare module "dojox/charting/Theme" {
  type Theme = dojox.charting.Theme;
  const Theme: dojox.charting.ThemeConstructor;
  export = Theme;
}

declare module "dstore/Csv" {
  type Csv = dstore.Csv;
  const Csv: dstore.CsvConstructor;
  export = Csv;
}
