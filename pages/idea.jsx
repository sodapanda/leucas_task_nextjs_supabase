import {
  Box,
  Button,
  Modal,
  TextInput,
  Text,
  Stack,
  ScrollArea,
  SimpleGrid,
  Flex,
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

  const [openSuperpowerModal, setOpenSuperpowerModal] = useState(false);
  const [inputSuperPower, setInputSuperPower] = useState('');
  const [superPowerList, setSuperPowerList] = useState([]);
  const [selectedSuperPower, setSelectedSuperPower] = useState(null);

  const [openIdeaModal, setOpenIdeaModal] = useState(false);
  const [inputIdeaName, setInputIdeaName] = useState('');
  const [inputNewInsight, setInputNewInsight] = useState('');
  const [inputAdvantage, setInputAdvantage] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');

  useEffect(() => {
    updateRole();
    updateSuperPower();
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

  async function updateSuperPower() {
    const { data, error } = await supabase.from('superpower').select('*');

    if (error) {
      setSuperPowerList([]);
    } else {
      setSuperPowerList(data);
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
                updateTrouble(selectedRole);
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
          <Button onClick={() => setOpenSuperpowerModal(true)}>add</Button>
          <Modal opened={openSuperpowerModal} onClose={() => setOpenSuperpowerModal(false)}>
            <TextInput
              label="Superpower"
              placeholder="Enter your superpower here"
              value={inputSuperPower}
              onChange={(event) => setInputSuperPower(event.target.value)}
            />
            <Button
              onClick={async () => {
                await supabase
                  .from('superpower')
                  .insert([{ user_id: user.id, superpower_name: inputSuperPower }]);
                setOpenSuperpowerModal(false);
                updateSuperPower();
              }}
            >
              Submit
            </Button>
          </Modal>
          <ScrollArea h={250}>
            {superPowerList.map((superpower) => (
              <Text
                key={superpower.id}
                style={{
                  backgroundColor:
                    selectedSuperPower && selectedSuperPower.id === superpower.id
                      ? 'blue'
                      : 'transparent',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                onClick={() => {
                  setSelectedSuperPower(superpower);
                }}
              >
                {superpower.superpower_name}
              </Text>
            ))}
          </ScrollArea>
        </Stack>
      </SimpleGrid>
      <Flex justify="flex-end" align="center" direction="row" wrap="nowrap">
        <Button
          disabled={!(selectedRole && selectedTrouble && selectedSuperPower)}
          onClick={() => {
            setOpenIdeaModal(true);
          }}
        >
          add idea
        </Button>

        <Modal opened={openIdeaModal} onClose={() => setOpenIdeaModal(false)}>
          <TextInput
            label="Idea Name"
            placeholder="Enter your idea name here"
            value={inputIdeaName}
            onChange={(event) => setInputIdeaName(event.target.value)}
          />
          <TextInput
            label="New Insight"
            placeholder="Enter your new insight here"
            value={inputNewInsight}
            onChange={(event) => setInputNewInsight(event.target.value)}
          />
          <TextInput
            label="Advantage"
            placeholder="Enter your advantage here"
            value={inputAdvantage}
            onChange={(event) => setInputAdvantage(event.target.value)}
          />
          <TextInput
            label="Keyword"
            placeholder="Enter your keyword here"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
          />
          <Button
            onClick={async () => {
              await supabase.from('idea').insert([
                {
                  user_id: user.id,
                  superpower_id: selectedSuperPower.id,
                  trouble_id: selectedTrouble.id,
                  idea_name: inputIdeaName,
                  new_insight: inputNewInsight,
                  advantage: inputAdvantage,
                  keyword: inputKeyword,
                },
              ]);
              setOpenIdeaModal(false);
            }}
          >
            Submit
          </Button>
        </Modal>
      </Flex>
    </Box>
  );
}
