import MallTablePage from "./MallTablePage"

export function createMallPage(config) {
  return {
    name: config.name,
    render(h) {
      return h(MallTablePage, {
        props: config
      })
    }
  }
}
