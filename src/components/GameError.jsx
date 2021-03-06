import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Group, Header, Cell } from '@vkontakte/vkui';

import useGlobal from '../hooks/use-global';

const GameError = ({ code }) => {
  const global = useGlobal();
  const prevent = useRef(false);

  let content = null;

  useEffect(() => {
    const reset = () => {
      window.requestAnimationFrame(() => {
        if (!prevent.current) {
          global.bus.emit('game:end');
        }
      });
    };

    global.bus.once('modal:closed', reset);
    return () => {
      global.bus.detach('modal:closed', reset);
    };
  }, []);

  if (code === 1 || code === 2 || code === 3 || code === 5 || code === 8) {
    let message = null;

    switch (code) {
      case 1:
      case 8:
        message = 'Похоже игра уже началась...';
        break;
      case 2:
      case 3:
        message = 'Похоже игра уже завершилась...';
        break;
      case 5:
        message = 'Похоже такой игры не существует...';
        break;
    }

    content = `${message} Это вовсе не проблема! Просто создай новую игру или присоединись к другой.`;
  } else if (code === 7) {
    content = 'Тебе одиноко? Это вовсе не проблема! Ты всегда можешь начать одиночную игру.';
  } else if (code === 4 || code === 6) {
    content = 'Пользователь еще не зашел в игру';
  }

  return (
    <Group header={<Header mode="secondary">Что-то пошло не так</Header>}>
      <Cell multiline={true}>
        {content}
      </Cell>
    </Group>
  );
};

GameError.propTypes = {
  code: PropTypes.number
};

export default GameError;
