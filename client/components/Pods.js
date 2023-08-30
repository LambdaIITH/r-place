import { Button, Group, HoverCard, Blockquote, Text } from "@mantine/core"

export default function Pods({floorData, floor, hostel}) {

  // search rooms in the floorData array and return a button if its a graduate room
  function search_room(room, item, key) {
    for (let i = 0; i < floorData.length; i++) {
      if (floor * 100 + floorData[i].room_number === room) {
        return return_room_button(floorData[i], item, key)
      }
    }
    // if room is not found in the floorData array, return a disabled button
    return (
      <Group position="center" key={key}>
        <Button
          style={{
            ...item,
            width: '40px',
            fontSize: '15px',
            padding: 0,
            position: 'absolute',
            zIndex: '100',
          }}
          disabled
        >{`${room}`}</Button>
      </Group>
    )
  }

  // return a button with the room number, owner name and quote as a hovercard
  function return_room_button(room_owner_data, item, key) {
    return (
      <Group position="center" key={key}>
        <HoverCard width={250} shadow="md" zIndex={101}>
          <HoverCard.Target>
            <Button
              style={{
                ...item,
                width: '40px',
                fontSize: '15px',
                padding: 0,
                position: 'absolute',
              }}
              component="a"
              href={`/hostels/${hostel}/${floor}/${room_owner_data.room_number}`}
            >
              {`${floor * 100 + room_owner_data.room_number}`}
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Blockquote
              cite={<Text fx="sm">{`- ${room_owner_data.name}`}</Text>}
            >
              <Text size={15}>{`${room_owner_data.quote}`}</Text>
            </Blockquote>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    )
  }

  // ehm, this is a long list of objects containing the position of the pods, hardcoded, could be improved
  const pods = [
    // first pod
    { top: '11rem', left: '7.3rem', transform: 'rotate(90deg)' },
    { top: '11rem', left: '4.5rem', transform: 'rotate(90deg)' },
    { top: '7.5rem', left: '.8rem', },
    { top: '4.5rem', left: '.8rem', },
    { top: '1rem', left: '4.5rem', transform: 'rotate(90deg)' },
    { top: '1rem', left: '7.3rem', transform: 'rotate(90deg)' },
    { top: '4.5rem', left: '11rem', },
    { top: '7.5rem', left: '11rem', },

    // second pod
    { top: 'calc(1rem + 12rem)', left: 'calc(12rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(1rem + 12rem)', left: 'calc(12rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(12rem + 11rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(12rem + 11rem)', },
    { top: 'calc(11rem + 12rem)', left: 'calc(12rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(11rem + 12rem)', left: 'calc(12rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(12rem + .8rem)', },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(12rem + .8rem)', },
    // third pod
    { top: '11rem', left: 'calc(24rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: '11rem', left: 'calc(24rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: '7.5rem', left: 'calc(24rem + .8rem)', },
    { top: '4.5rem', left: 'calc(24rem + .8rem)', },
    { top: '1rem' , left: 'calc(24rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: '1rem', left: 'calc(24rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: '4.5rem', left: 'calc(24rem + 11rem)', },
    { top: '7.5rem', left: 'calc(24rem + 11rem)', },
    // fourth pod
    { top: 'calc(1rem + 12rem)', left: 'calc(35.6rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(1rem + 12rem)', left: 'calc(35.6rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(35.6rem + 11rem)', },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(35.6rem + 11rem)', },
    { top: 'calc(11rem + 12rem)', left: 'calc(35.6rem + 7.3rem)', transform: 'rotate(90deg)' },
    { top: 'calc(11rem + 12rem)', left: 'calc(35.6rem + 4.5rem)', transform: 'rotate(90deg)' },
    { top: 'calc(7.5rem + 12rem)', left: 'calc(35.6rem + .8rem)', },
    { top: 'calc(4.5rem + 12rem)', left: 'calc(35.6rem + .8rem)', },

  ]
    return (
      <>
        {floorData == undefined ? (
          <></>
        ) : (
          pods.map((item, index) => {
            return search_room(floor * 100 + index + 1, item, index)
          })
        )}
      </>
    )
}