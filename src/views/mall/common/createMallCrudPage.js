import MallCrudPage from "./MallCrudPage"

export function createMallCrudPage(config) {
  return {
    name: config.name,
    render(h) {
      return h(MallCrudPage, {
        props: config
      })
    }
  }
}
