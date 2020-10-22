import { IConfigItem } from "./Tree";

export const treeConfig: IConfigItem[] = [
  {
    id: "1",
    title: "Title 1",
    children: [
      {
        id: "2",
        title: "Title 2",
        children: [
          {
            id: "3",
            title: "Title 3",
            children: [
              {
                id: "4",
                title: "Title 4",
                children: [
                  {
                    id: "5",
                    title: "Title 5"
                  },
                  {
                    id: "6",
                    title: "Title 6"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "7",
    title: "Title 7",
    children: [
      {
        id: "8",
        title: "Title 8",
        children: [
          {
            id: "9",
            title: "Title 9"
          }
        ]
      }
    ]
  }
];
