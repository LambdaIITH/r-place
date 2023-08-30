import AppContext from '../AppContext'
import { useContext, useState } from 'react'
import {
  ColorSwatch,
  createStyles,
  MediaQuery,
  rem,
  Group,
} from '@mantine/core'
import { CheckIcon } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  pallete: {
    width: rem(690),
    [theme.fn.smallerThan('lg')]: {
      width: rem(190),
    },
  },
  swatches: {
    border: '0.5px solid #FFF',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

export default function Pallete(props) {
  const { classes, cx } = useStyles()

  const [chosen, setChosen] = useState('#ffffff') // from 14 color palette

  const value = useContext(AppContext)
  let globalData = value.state.globalData
  let { colorPalette } = globalData
  const swatches = colorPalette.map((color, index) => (
    <ColorSwatch
      key={index}
      color={color}
      component="button"
      className={classes.swatches}
      // size={20}
      onClick={() => {
        props.setChosen(color)
        setChosen(color)
      }}
    >
      {chosen === color ? <CheckIcon width={rem(10)} /> : ''}
    </ColorSwatch>
  ))
  return (
    <>
      <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
        <Group
          className={classes.pallete}
          position="center"
          spacing="xs"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(16, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
          }}
        >
          {swatches}
        </Group>
      </MediaQuery>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        <Group
          className={classes.pallete}
          position="center"
          spacing="xs"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
          }}
        >
          {swatches}
        </Group>
      </MediaQuery>
    </>
  )
}
