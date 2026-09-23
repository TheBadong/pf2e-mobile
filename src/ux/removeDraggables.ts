/**
 * Remove useless draggable elements
 */
export default (html: JQuery<HTMLElement>) => {
  const parsedHtml = html.get(0);

  parsedHtml?.querySelectorAll('.item[draggable=true]').forEach(elem => {
    elem.setAttribute('draggable', "false");
  });
}