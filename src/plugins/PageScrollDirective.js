const PageScrollDirective = {
  mounted(el, binding) {
    el.__PageScroll__ = binding.value;
    document.body.addEventListener("scroll", el.__PageScroll__);
  },

  unmounted(el) {
    document.body.removeEventListener("scroll", el.__PageScroll__);
  },
};

export default (app) => {
  app.directive("page-scroll", PageScrollDirective);
};
