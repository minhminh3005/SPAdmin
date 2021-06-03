import React from 'react';
import { Header } from 'semantic-ui-react';
import BotVolumeForm from './BotVolumeForm'

export default function AddBotVolume() {
    return (
        <>
        <Header>Add Volume Bot</Header>
        <BotVolumeForm  action="create" />
      </>
    )
}
