export type ConfigType = {
  basic: {
    name: string;
    description: string;
    show: boolean;
    children: never[];
  };
  windows: {
    name: string;
    description: string;
    show: boolean;
    closeAppMode: number;
    winsNum: number;
    children: ({
      name: string;
      description: string;
      type: string;
      value: string;
      props: {
        data: {
          label: string;
          value: number;
        }[];
      };
    } | {
      name: string;
      description: string;
      type: string;
      value: number;
      props?: undefined;
    })[];
  };
  language: {
    name: string;
    description: string;
    show: boolean;
    isShowReset: boolean;
    isNeedReload: boolean;
    lang: string;
    children: {
      name: string;
      description: string;
      type: string;
      props: {};
    }[];
  };
  network: {
    name: string;
    description: string;
    show: boolean;
    baseUrl: string;
    children: {
      name: string;
      description: string;
      type: string;
      props: {};
    }[];
  };
  download: {
    name: string;
    description: string;
    show: boolean;
    downloadPath: string;
    children: {
      name: string;
      description: string;
      type: string;
      props: {};
    }[];
  };
};

