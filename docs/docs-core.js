/* Ranj UI docs — registry API. Registry files call RanjDocs.add({...}). */
(function (w) {
  var items = [];
  var GROUP_ORDER = ['Foundations', 'Layout', 'Base', 'Data Display', 'Forms', 'Navigation', 'Overlays', 'Feedback', 'Text Effects', 'Motion', 'Interactions', 'Backgrounds', 'Micro-interactions', 'Loaders', 'Blocks'];
  w.RanjDocs = {
    items: items,
    groupOrder: GROUP_ORDER,
    /**
     * add({ id, name, group, description, tags?:['new'|'fx'|'js'], keywords?:[],
     *       demos: [{ title, html, css?, js?, description?, height?, pad?, center?, bg?:'grid'|'dots'|'dark'|'none', replay? }],
     *       api?: [{ name, type:'class'|'attr'|'js'|'event'|'var', default?, desc }],
     *       notes?: 'html string' })
     */
    add: function (def) {
      if (Array.isArray(def)) return def.forEach(RanjDocs.add);
      if (!def.id || !def.name) { console.warn('RanjDocs.add: id + name required', def); return; }
      if (items.some(function (i) { return i.id === def.id; })) { console.warn('RanjDocs: duplicate id ' + def.id); return; }
      def.group = def.group || 'Base';
      def.demos = def.demos || [];
      items.push(def);
    }
  };
})(window);
