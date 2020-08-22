import { hashCode, treeify, prepareListNodes, tree2Json, trimSlashes,  splitPath } from './index'

const currentDate = 1598016948357
const mr_robot_ep1s0d3s = [
  {name: "eps1.7_wh1ter0se",        size: 98845568,   date: currentDate, path: "/",                    ext: "m4v" }, 
  {name: "eps1.6_v1ew-s0urce",      size: 86754456,   date: currentDate, path: "videos",               ext: "flv" },
  {name: "eps1.0_hellofriend",      size: 765000000,  date: currentDate, path: "home/videos",          ext: "mov" },
  {name: "eps1.2_d3bug",            size: 434535565,  date: currentDate, path: "home/videos",          ext: "mkv" },
  {name: "eps1.9_zer0-day",         size: 78678876,   date: currentDate, path: "home/Downloads",       ext: "avi" }, 
  {name: "eps1.1_ones-and-zer0es",  size: 724004488,  date: currentDate, path: "home/videos/mr-robot", ext: "mpeg" },
  {name: "eps1.3_da3m0ns",          size: 78678678,   date: currentDate, path: "home/video/mr-robot",  ext: "mp4" },
  {name: "eps1.4_3xpl0its",         size: 56677878,   date: currentDate, path: "home/videos/MR-ROBOT", ext: "wmv" },
  {name: "eps1.5_br4ve-trave1er",   size: 78678676,   date: currentDate, path: "home/videos/MR-ROBOT", ext: "asf" },
  {name: "eps1.8_m1rr0r1ng",        size: 49116514,   date: currentDate, path: "var/etc/logs",         ext: "qt" }, 
]


describe("Directory Parser", () => {
  describe("prepareListNodes", () => {
    test("Should create list of directories and files", () => {
      const List = prepareListNodes( [
        {name: "eps1.0_hellofriend", size: 765000000, date: currentDate, path: "home/videos", "ext": "mov" },
        {name: "eps1.1_ones-and-zer0es", size: 724004488, date: currentDate, path: "home/videos", "ext": "mpeg" }
      ])

      const IDHome = hashCode('home')
      const IDVideos = hashCode('videos')

      expect(List).toHaveLength(4)
      expect(List).toStrictEqual([
        {
          id: IDHome,
          title: 'home',
          parent: null
        },
        {
          id: IDVideos,
          title: 'videos',
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
      const List = prepareListNodes([])
      expect(List).toHaveLength(0)
      expect(List).toStrictEqual([])
    })

    test("Should properly parse paths like '/'", () => {
      const List = prepareListNodes([
        {name: "eps1.0_hellofriend", size: 765000000, date: currentDate, path: "/", "ext": "mov" },
      ])
      const IDPath = hashCode('/')

      expect(List).toHaveLength(2)
      expect(List).toStrictEqual([
        {
          id: IDPath,
          title: '/',
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
      const List = prepareListNodes([
        {name: "eps1.0_hellofriend", size: 765000000, date: currentDate, path: "/videos", "ext": "mov" },
      ])
      const IDPath = hashCode('videos')

      expect(List).toHaveLength(2)
      expect(List).toStrictEqual([
        {
          id: IDPath,
          title: 'videos',
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
      const List = prepareListNodes([
        {name: "eps1.0_hellofriend", size: 765000000, date: currentDate, path: "/", "ext": "mov" },
      ])
      const IDPath = hashCode('/')

      expect(List).toHaveLength(2)
      expect(List).toStrictEqual([
        {
          id: IDPath,
          title: '/',
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
      const List = prepareListNodes([
        {name: "eps1.0_hellofriend", size: 765000000, date: 1, path: "videos", ext: "mov" },
        {name: "eps1.0_hellofriend", size: 765000000, date: 1, path: "videos", ext: "mov" }
      ])
      const IDVideos = hashCode('videos')

      expect(List).toHaveLength(2)
      expect(List).toStrictEqual([
        {
          id: IDVideos,
          title: 'videos',
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

  describe("treeify", () => {
    test("returns generated tree from listified list", () => {
      const Tree = treeify( [
      {name: "eps1.0_hellofriend", size: 765000000, date: currentDate, path: "home/videos", "ext": "mov" },
      {name: "eps1.1_ones-and-zer0es", size: 724004488, date: currentDate, path: "home/videos", "ext": "mpeg" }
    ])
      
      const IDHome = hashCode('home')
      const IDVideos = hashCode('videos')

      expect(Tree).toHaveLength(1)
      expect(Tree).toStrictEqual([
        {
          id: IDHome,
          title: 'home',
          parent: null,
          files: [],
          dirs: [
            {
              id: IDVideos,
              title: 'videos',
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
      const Tree = treeify(mr_robot_ep1s0d3s)
      
      expect(Tree).toHaveLength(4)
      expect(Tree).toStrictEqual([
        {
          id: hashCode("/"),
          title: '/',
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
              parent: hashCode("/")
            }
          ]
        },
        {
          id: hashCode("videos"),
          title: "videos",
          parent: null,
          dirs: [
            {
              id: hashCode('mr-robot'),
              title: "mr-robot",
              parent: 816678056,
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
              title: "MR-ROBOT",
              parent: 816678056,
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
          title: "home",
          parent: null,
          dirs: [
            {
              id: hashCode('Downloads'),
              title: "Downloads",
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
              title: "video",
              parent: hashCode("home"),
              dirs: [],
              files: []
            }
          ],
          files: []
        },
        {
          id: hashCode('var'),
          title: "var",
          parent: null,
          dirs: [
            {
              id: hashCode('etc'),
              title: "etc",
              parent: hashCode('var'),
              dirs: [
                {
                  id: hashCode("logs"),
                  title: "logs",
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
                      parent: 3327407
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

  describe("trimSlashes", () => {
    test("trims slashes from left", () => {
      const trimmed = trimSlashes('/home')
      expect(trimmed).toEqual('home')
    })

    test("trims slashes from right", () => {
      const trimmed = trimSlashes('home/')
      expect(trimmed).toEqual('home')
    })

    test("trims slashes from left and right", () => {
      const trimmed = trimSlashes('/home/pics/rick-and-morty/')
      expect(trimmed).toEqual('home/pics/rick-and-morty')
    })
  })

  describe("splitPath", () => {
    test("splits path without trailing slashes", () => {
      const splitted = splitPath('home/videos')

      expect(splitted).toHaveLength(2)
      expect(splitted).toStrictEqual([
        'home', 'videos'
      ])
    })

    test("splits path with left trailing slashes, nested dirs", () => {
      const splitted = splitPath('/app/coverage')

      expect(splitted).toHaveLength(2)
      expect(splitted).toStrictEqual([
        'app', 'coverage'
      ])
    })

    test("splits path with right trailing slashes, nested dirs", () => {
      const splitted = splitPath('app/coverage/')

      expect(splitted).toHaveLength(2)
      expect(splitted).toStrictEqual([
        'app', 'coverage'
      ])
    })

    test("splits path with left trailing slashes and single dir", () => {
      const splitted = splitPath('/coverage')

      expect(splitted).toHaveLength(1)
      expect(splitted).toStrictEqual(['coverage'
      ])
    })

    test("splits path with right trailing slashes and single dir", () => {
      const splitted = splitPath('coverage/')

      expect(splitted).toHaveLength(1)
      expect(splitted).toStrictEqual(['coverage'])
    })

    test("splits path with input '/'", () => {
      const splitted = splitPath('/')

      expect(splitted).toHaveLength(1)
      expect(splitted).toStrictEqual('/')
    })

    test("returns empty array of string for empty path", () => {
      const splitted = splitPath('')

      expect(splitted).toHaveLength(1)
      expect(splitted).toStrictEqual('/')
    })
  })
})