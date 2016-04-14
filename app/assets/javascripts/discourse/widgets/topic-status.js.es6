import { createWidget } from 'discourse/widgets/widget';
import { iconNode } from 'discourse/helpers/fa-icon';
import { h } from 'virtual-dom';

function renderIcon(name, key, canAct) {
  const iconArgs = key === 'unpinned' ? { 'class': 'unpinned' } : null,
        icon = iconNode(name, iconArgs);

  const attributes = { title: Discourse.Utilities.escapeExpression(I18n.t(`topic_statuses.${key}.help`)) };
  return h(`${canAct ? 'a' : 'span'}.topic-status`, attributes, icon);
}

export default createWidget('topic-status', {
  html(attrs) {
    const topic = attrs.topic;
    const canAct = this.currentUser && !attrs.disableActions;

    const result = [];
    const renderIconIf = (conditionProp, name, key) => {
      if (!topic.get(conditionProp)) { return; }
      result.push(renderIcon(name, key, canAct));
    };

    renderIconIf('is_warning', 'envelope', 'warning');

    if (topic.get('closed') && topic.get('archived')) {
      renderIcon('lock', 'locked_and_archived');
    } else {
      renderIconIf('topic.closed', 'lock', 'locked');
      renderIconIf('topic.archived', 'lock', 'archived');
    }

    renderIconIf('topic.pinned', 'thumb-tack', 'pinned');
    renderIconIf('topic.unpinned', 'thumb-tack', 'unpinned');
    renderIconIf('topic.invisible', 'eye-slash', 'invisible');

    return result;
  }
});
