import React from 'react'
import { Composition } from 'remotion'
import { Helpdesk, type HelpdeskProps } from './compositions/Helpdesk'

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Helpdesk"
      component={Helpdesk as unknown as React.ComponentType<Record<string, unknown>>}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{
        theme: 'red',
        layout: 'standard',
        width: 1080,
        height: 1080,
        topElement: 'icon',
        iconUrl: '',
        bigTitle: '',
        bodyText: '',
        date: '',
        backgroundImage: '',
        logoVariant: 'light',
        bodyFont: 'TKTextVF, sans-serif',
        letterSpacing: '0.025em',
      }}
      calculateMetadata={async ({ props }) => {
        const p = props as unknown as HelpdeskProps
        return { width: p.width ?? 1080, height: p.height ?? 1080 }
      }}
    />
  </>
)
