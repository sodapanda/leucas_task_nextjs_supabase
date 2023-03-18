import {
  Box,
  Group,
  Button,
  Modal,
  TextInput,
  Text,
  Stack,
  ScrollArea,
  SimpleGrid,
} from '@mantine/core';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function Idea() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [inputRole, setInputRole] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openTroubleModal, setOpenTroubleModal] = useState(false);
  const [inputTrouble, setInputTrouble] = useState('');
  const [troubleList, setTroubleList] = useState([]);
  const [selectedTrouble, setSelectedTrouble] = useState(null);

  useEffect(() => {
    updateRole();
  }, []);

  async function updateRole() {
    const { data, error } = await supabase.from('role').select('*');

    if (error) {
      setRoleList([]);
    } else {
      setRoleList(data);
    }
  }

  async function updateTrouble(role) {
    if (role) {
      const { data, error } = await supabase.from('trouble').select('*').eq('role_id', role.id);

      if (error) {
        setTroubleList([]);
      } else {
        setTroubleList(data);
      }
    }
  }

  return (
    <Box component="div">
      <SimpleGrid cols={3} h={300} className="overflow-hidden bg-red-50">
        <Stack component="div" h="auto">
          <Button onClick={() => setOpenRoleModal(true)}>add</Button>
          <Modal opened={openRoleModal} onClose={() => setOpenRoleModal(false)}>
            <TextInput
              label="Role"
              placeholder="Enter your role here"
              value={inputRole}
              onChange={(event) => setInputRole(event.target.value)}
            />
            <Button
              onClick={async () => {
                await supabase.from('role').insert([{ user_id: user.id, role_name: inputRole }]);
                setOpenRoleModal(false);
                updateRole();
              }}
            >
              Submit
            </Button>
          </Modal>
          <ScrollArea h={250}>
            {roleList.map((role) => (
              <Text
                key={role.id}
                style={{
                  backgroundColor:
                    selectedRole && selectedRole.id === role.id ? 'blue' : 'transparent',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                onClick={() => {
                  setSelectedRole(role);
                  updateTrouble(role);
                }}
              >
                {role.role_name}
              </Text>
            ))}
          </ScrollArea>
        </Stack>
        <Stack component="div" h="auto">
          <Button disabled={!selectedRole} onClick={() => setOpenTroubleModal(true)}>
            add
          </Button>
          <Modal opened={openTroubleModal} onClose={() => setOpenTroubleModal(false)}>
            <TextInput
              label="Trouble"
              placeholder="Enter your trouble here"
              value={inputTrouble}
              onChange={(event) => setInputTrouble(event.target.value)}
            />
            <Button
              onClick={async () => {
                await supabase
                  .from('trouble')
                  .insert([
                    { user_id: user.id, role_id: selectedRole.id, trouble_name: inputTrouble },
                  ]);
                setOpenTroubleModal(false);
                updateTrouble();
              }}
            >
              Submit
            </Button>
          </Modal>
          {troubleList.map((trouble) => (
            <Text
              key={trouble.id}
              style={{
                backgroundColor:
                  selectedTrouble && selectedTrouble.id === trouble.id ? 'blue' : 'transparent',
                cursor: 'pointer',
                padding: '4px',
              }}
              onClick={() => {
                setSelectedTrouble(trouble);
              }}
            >
              {trouble.trouble_name}
            </Text>
          ))}
        </Stack>
        <Stack component="div" h="auto">
          superpower
        </Stack>
      </SimpleGrid>
    </Box>
  );
}
