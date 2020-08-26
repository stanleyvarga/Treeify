import { treeify, parentify } from './index'
import { hashCode } from './utils'

const currentDate = 1598016948357
const mr_robot_ep1s0d3s = [
  { path: "/", name: "eps1.7_wh1ter0se", size: 98845568, date: currentDate, ext: "m4v" }, 
  { path: "videos", name: "eps1.6_v1ew-s0urce", size: 86754456, date: currentDate, ext: "flv" },
  { path: "home/videos", name: "eps1.0_hellofriend", size: 765000000, date: currentDate, ext: "mov" },
  { path: "home/videos", name: "eps1.2_d3bug", size: 434535565, date: currentDate, ext: "mkv" },
  { path: "home/Downloads", name: "eps1.9_zer0-day", size: 78678876, date: currentDate, ext: "avi" }, 
  { path: "home/videos/mr-robot", name: "eps1.1_ones-and-zer0es", size: 724004488, date: currentDate, ext: "mpeg" },
  { path: "home/video/mr-robot", name: "eps1.3_da3m0ns", size: 78678678, date: currentDate, ext: "mp4" },
  { path: "home/videos/MR-ROBOT", name: "eps1.4_3xpl0its", size: 56677878, date: currentDate, ext: "wmv" },
  { path: "home/videos/MR-ROBOT", name: "eps1.5_br4ve-trave1er", size: 78678676, date: currentDate, ext: "asf" },
  { path: "var/etc/logs", name: "eps1.8_m1rr0r1ng", size: 49116514, date: currentDate, ext: "qt" }, 
]

describe("Parentify", () => {
  test("Should create list of directories and files", () => {
    const List = parentify( [
      {
        path: "home/videos",
        name: "eps1.0_hellofriend", size: 765000000, date: currentDate, ext: "mov"
      },
      {
        path: "home/videos",
        name: "eps1.1_ones-and-zer0es", size: 724004488, date: currentDate, ext: "mpeg" 
      }
    ])

    const IDHome = hashCode('home')
    const IDVideos = hashCode('videos')

    expect(List).toHaveLength(4)
    expect(List).toStrictEqual([
      {
        id: IDHome,
        label: 'home',
        parent: null
      },
      {
        id: IDVideos,
        label: 'videos',
        parent: IDHome
      },
      {
        id: hashCode('eps1.0_hellofriend'),
        parent: IDVideos,
        name: "eps1.0_hellofriend", 
        size: 765000000, 
        date: currentDate, 
        path: "home/videos", 
        ext: "mov"
      },
      {
        id: hashCode('eps1.1_ones-and-zer0es'),
        parent: IDVideos,
        name: "eps1.1_ones-and-zer0es", 
        size: 724004488, 
        date: currentDate, 
        path: "home/videos", 
        ext: "mpeg"
      },
    ])
  })

  test("Should create empty list from empty fileList", () => {
    const List = parentify([])
    expect(List).toHaveLength(0)
    expect(List).toStrictEqual([])
  })

  test("Should properly parse paths like '/'", () => {
    const List = parentify([
      {
        path: "/",
        name: "eps1.0_hellofriend", size: 765000000, date: currentDate,  ext: "mov"
      },
    ])
    const IDPath = hashCode('/')

    expect(List).toHaveLength(2)
    expect(List).toStrictEqual([
      {
        id: IDPath,
        label: '/',
        parent: null
      },
      {
        id: hashCode('eps1.0_hellofriend'),
        parent: IDPath,
        name: "eps1.0_hellofriend", 
        size: 765000000, 
        date: currentDate, 
        path: "/", 
        ext: "mov"
      }
    ])
  })

  test("Should properly parse paths like '/videos'", () => {
    const List = parentify([
      {
        path: "/videos",
        name: "eps1.0_hellofriend", size: 765000000, date: currentDate, ext: "mov"
      },
    ])
    const IDPath = hashCode('videos')

    expect(List).toHaveLength(2)
    expect(List).toStrictEqual([
      {
        id: IDPath,
        label: 'videos',
        parent: null
      },
      {
        id: hashCode('eps1.0_hellofriend'),
        parent: IDPath,
        name: "eps1.0_hellofriend", 
        size: 765000000, 
        date: currentDate, 
        path: "videos", 
        ext: "mov"
      }
    ])
  })

  test("Should properly parse empty paths like ''", () => {
    const List = parentify([
      {
        path: "/", 
        name: "eps1.0_hellofriend", size: 765000000, date: currentDate, ext: "mov"
      },
    ])
    const IDPath = hashCode('/')

    expect(List).toHaveLength(2)
    expect(List).toStrictEqual([
      {
        id: IDPath,
        label: '/',
        parent: null
      },
      {
        id: hashCode('eps1.0_hellofriend'),
        parent: IDPath,
        name: "eps1.0_hellofriend", 
        size: 765000000, 
        date: currentDate, 
        path: "/", 
        ext: "mov"
      }
    ])
  })

  test("Should properly handle duplicates'", () => {
    const List = parentify([
      {
        path: "videos", 
        name: "eps1.0_hellofriend", size: 765000000, date: 1, ext: "mov"
      },
      {
        path: "videos", 
        name: "eps1.0_hellofriend", size: 765000000, date: 1, ext: "mov"
      },
    ])
    const IDVideos = hashCode('videos')

    expect(List).toHaveLength(2)
    expect(List).toStrictEqual([
      {
        id: IDVideos,
        label: 'videos',
        parent: null
      },
      {
        id: hashCode('eps1.0_hellofriend'),
        parent: IDVideos,
        name: "eps1.0_hellofriend", 
        size: 765000000, 
        date: 1, 
        path: "videos", 
        ext: "mov"
      }
    ])
  })
})

describe("Treeify", () => {
  test("returns generated tree from listified list", () => {
    const parent2ChildrenList = parentify([
        {
          path: "home/videos",
          name: "eps1.0_hellofriend", size: 765000000, date: currentDate, ext: "mov" 
        },
        {
          path: "home/videos",
          name: "eps1.1_ones-and-zer0es", size: 724004488, date: currentDate, ext: "mpeg" 
        }
      ]
    )
    const Tree = treeify(parent2ChildrenList)
    
    const IDHome = hashCode('home')
    const IDVideos = hashCode('videos')

    expect(Tree).toHaveLength(1)
    expect(Tree).toStrictEqual([
      {
        id: IDHome,
        label: 'home',
        parent: null,
        files: [],
        dirs: [
          {
            id: IDVideos,
            label: 'videos',
            parent: IDHome,
            dirs: [],
            files: [
              {
                id: hashCode("eps1.0_hellofriend"),
                name: "eps1.0_hellofriend",
                size: 765000000,
                date: currentDate,
                path: "home/videos",
                ext: "mov",
                parent: IDVideos
              },
              {
                id: hashCode("eps1.1_ones-and-zer0es"),
                name: "eps1.1_ones-and-zer0es",
                size: 724004488,
                date: currentDate,
                path: "home/videos",
                ext: "mpeg",
                parent: IDVideos
              }
            ]
          }
        ]
      }
    ])
  })

  test("returns generated tree from mr_robot_ep1s0d3s fileList", () => {
    const Tree = treeify(parentify(mr_robot_ep1s0d3s))

    const IDRoot = hashCode("/")
    
    expect(Tree).toHaveLength(4)
    expect(Tree).toStrictEqual([
      {
        id: IDRoot,
        label: '/',
        parent: null,
        dirs: [],
        files: [
          {
            id: hashCode("eps1.7_wh1ter0se"),
            name: "eps1.7_wh1ter0se",
            size: 98845568,
            path: "/",
            date: 1598016948357,
            ext: "m4v",
            parent: IDRoot
          }
        ]
      },
      {
        id: hashCode("videos"),
        label: "videos",
        parent: null,
        dirs: [
          {
            id: hashCode('mr-robot'),
            label: "mr-robot",
            parent: hashCode("videos"),
            dirs: [],
            files: [
              {
                id: hashCode("eps1.1_ones-and-zer0es"),
                name: "eps1.1_ones-and-zer0es",
                size: 724004488,
                path: "home/videos/mr-robot",
                date: 1598016948357,
                ext: "mpeg",
                parent: hashCode('mr-robot')
              },
              {
                id: hashCode("eps1.3_da3m0ns"),
                name: "eps1.3_da3m0ns",
                size: 78678678,
                path: "home/video/mr-robot",
                date: 1598016948357,
                ext: "mp4",
                parent: hashCode('mr-robot')
              }
            ]
          },
          {
            id: hashCode("MR-ROBOT"),
            label: "MR-ROBOT",
            parent: hashCode("videos"),
            dirs: [],
            files: [
              {
                id: hashCode("eps1.4_3xpl0its"),
                name: "eps1.4_3xpl0its",
                size: 56677878,
                path: "home/videos/MR-ROBOT",
                date: 1598016948357,
                ext: "wmv",
                parent: hashCode("MR-ROBOT")
              },
              {
                id: hashCode("eps1.5_br4ve-trave1er"),
                name: "eps1.5_br4ve-trave1er",
                size: 78678676,
                path: "home/videos/MR-ROBOT",
                date: 1598016948357,
                ext: "asf",
                parent: hashCode("MR-ROBOT")
              }
            ]
          }
        ],
        files: [
          {
            id: hashCode("eps1.6_v1ew-s0urce"),
            name: "eps1.6_v1ew-s0urce",
            size: 86754456,
            path: "videos",
            date: 1598016948357,
            ext: "flv",
            parent: hashCode("videos"),
          },
          {
            id: hashCode("eps1.0_hellofriend"),
            name: "eps1.0_hellofriend",
            size: 765000000,
            path: "home/videos",
            date: 1598016948357,
            ext: "mov",
            parent: hashCode("videos"),
          },
          {
            id: hashCode("eps1.2_d3bug"),
            name: "eps1.2_d3bug",
            size: 434535565,
            path: "home/videos",
            date: 1598016948357,
            ext: "mkv",
            parent: hashCode("videos"),
          }
        ]
      },
      {
        id: hashCode("home"),
        label: "home",
        parent: null,
        dirs: [
          {
            id: hashCode('Downloads'),
            label: "Downloads",
            parent: hashCode("home"),
            dirs: [],
            files: [
              {
                id: hashCode("eps1.9_zer0-day"),
                name: "eps1.9_zer0-day",
                size: 78678876,
                path: "home/Downloads",
                date: 1598016948357,
                ext: "avi",
                parent: hashCode('Downloads')
              }
            ]
          },
          {
            id: hashCode('video'),
            label: "video",
            parent: hashCode("home"),
            dirs: [],
            files: []
          }
        ],
        files: []
      },
      {
        id: hashCode('var'),
        label: "var",
        parent: null,
        dirs: [
          {
            id: hashCode('etc'),
            label: "etc",
            parent: hashCode('var'),
            dirs: [
              {
                id: hashCode("logs"),
                label: "logs",
                parent: hashCode('etc'),
                dirs: [],
                files: [
                  {
                    id: hashCode("eps1.8_m1rr0r1ng"),
                    name: "eps1.8_m1rr0r1ng",
                    size: 49116514,
                    path: "var/etc/logs",
                    date: 1598016948357,
                    ext: "qt",
                    parent: hashCode("logs")
                  }
                ]
              }
            ],
            files: []
          }
        ],
        files: []
      }
    ])
  })
})