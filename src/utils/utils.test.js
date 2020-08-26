import { hashCode, trimSlashes, splitPath } from '.'

describe("Utilities", () => {
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
})