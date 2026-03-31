declare module 'fvtt-types/configuration' {
  namespace Hooks {
    interface HookConfig {
      renderCharacterSheetPF2e: (
        app: Pf2eCharacterSheetData,
        html: JQuery<HTMLElement>,
        data: Awaited<ReturnType<Pf2eCharacterSheetData['getData']>>,
      ) => void;
    }
  }
}

interface Pf2eCharacterSheetData extends Application.Any {
  getData: () => {
    document: {
      uuid: string;
    };
  };
}
