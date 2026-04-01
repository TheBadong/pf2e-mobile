declare module 'fvtt-types/configuration' {
  namespace Hooks {
    interface HookConfig {
      renderCharacterSheetPF2e: (
        app: Pf2eCharacterSheet,
        html: JQuery<HTMLElement>,
        data: Pf2eCharacterSheetData,
      ) => void;
    }
  }
}

interface Pf2eCharacterSheet extends Application.Any {
  getData: () => {
    document: {
      uuid: string;
    };
  };
}

export type Pf2eCharacterSheetData = Awaited<
  ReturnType<Pf2eCharacterSheet['getData']>
>;
