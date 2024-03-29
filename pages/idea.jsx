import {
  Box,
  Button,
  Modal,
  TextInput,
  Text,
  Stack,
  Group,
  ActionIcon,
  Divider,
  ScrollArea,
  SimpleGrid,
  Flex,
} from '@mantine/core';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { IconDots, IconTrash } from '@tabler/icons';

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

  const [ideaList, setIdeaList] = useState([]);

  const [openIdeaDetailModal, setOpenIdeaDetailModal] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    updateRole();
    updateSuperPower();
    updateIdeaList();

    setHeight(window.innerHeight / 2);

    const handleResize = () => {
      setHeight(window.innerHeight / 2);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  async function updateRole() {
    const { data, error } = await supabase
      .from('role')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setRoleList([]);
    } else {
      setRoleList(data);
    }
  }

  async function updateTrouble(role) {
    if (role) {
      const { data, error } = await supabase
        .from('trouble')
        .select('*')
        .eq('role_id', role.id)
        .order('id', { ascending: false });

      if (error) {
        setTroubleList([]);
      } else {
        setTroubleList(data);
      }
    }
  }

  async function updateSuperPower() {
    const { data, error } = await supabase
      .from('superpower')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setSuperPowerList([]);
    } else {
      setSuperPowerList(data);
    }
  }

  async function updateIdeaList() {
    const { data, error } = await supabase
      .from('idea_view')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      setIdeaList([]);
    } else {
      setIdeaList(data);
    }
  }
  return (
    <Box component="div">
      <SimpleGrid cols={3}>
        <Stack component="div" className="bg-cyan-50">
          <Button onClick={() => setOpenRoleModal(true)}>add</Button>
          <Modal opened={openRoleModal} onClose={() => setOpenRoleModal(false)}>
            <TextInput
              label="角色"
              placeholder="...的人 ...的用户 ...爱好者 ...消费者"
              value={inputRole}
              onChange={(event) => setInputRole(event.target.value)}
            />
            <Button
              disabled={!inputRole}
              onClick={async () => {
                await supabase.from('role').insert([{ user_id: user.id, role_name: inputRole }]);
                setOpenRoleModal(false);
                setInputRole('');
                updateRole();
              }}
            >
              Submit
            </Button>
          </Modal>
          <ScrollArea sx={{ height: `${height - 100}px` }}>
            {roleList.map((role) => (
              <Box component="div" key={role.id}>
                <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
                  <ActionIcon
                    color="blue"
                    radius="lg"
                    variant="filled"
                    ml="sm"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from('role')
                        .delete()
                        .eq('id', `${role.id}`);
                      if (error) {
                        alert(error.message);
                      }
                      updateRole();
                    }}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                  <Text
                    mx="xs"
                    fz="sm"
                    style={{
                      backgroundColor:
                        selectedRole && selectedRole.id === role.id
                          ? 'rgb(6 182 212)'
                          : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedRole(role);
                      updateTrouble(role);
                    }}
                  >
                    {role.role_name}
                  </Text>
                </Flex>
                <Divider my="xs" variant="dashed"></Divider>
              </Box>
            ))}
          </ScrollArea>
        </Stack>
        <Stack component="div" h="auto" className="bg-sky-50">
          <Button disabled={!selectedRole} onClick={() => setOpenTroubleModal(true)}>
            add
          </Button>
          <Modal opened={openTroubleModal} onClose={() => setOpenTroubleModal(false)}>
            <TextInput
              label="Trouble"
              placeholder="...很慢 ...很烦 ...很多 ...很难"
              value={inputTrouble}
              onChange={(event) => setInputTrouble(event.target.value)}
            />
            <Button
              disabled={!inputTrouble}
              onClick={async () => {
                await supabase
                  .from('trouble')
                  .insert([
                    { user_id: user.id, role_id: selectedRole.id, trouble_name: inputTrouble },
                  ]);
                setOpenTroubleModal(false);
                updateTrouble(selectedRole);
                setInputTrouble('');
              }}
            >
              Submit
            </Button>
          </Modal>
          <ScrollArea sx={{ height: `${height - 100}px` }}>
            {troubleList.map((trouble) => (
              <Box component="div" key={trouble.id}>
                <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
                  <ActionIcon
                    color="blue"
                    radius="lg"
                    variant="filled"
                    ml="sm"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from('trouble')
                        .delete()
                        .eq('id', `${trouble.id}`);
                      if (error) {
                        alert(error.message);
                      }
                      updateTrouble(selectedRole);
                    }}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                  <Text
                    mx="xs"
                    fz="sm"
                    style={{
                      backgroundColor:
                        selectedTrouble && selectedTrouble.id === trouble.id
                          ? 'rgb(14 165 233)'
                          : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedTrouble(trouble);
                    }}
                  >
                    {trouble.trouble_name}
                  </Text>
                </Flex>
                <Divider my="xs" variant="dashed"></Divider>
              </Box>
            ))}
          </ScrollArea>
        </Stack>
        <Stack component="div" h="auto" className="bg-red-50	">
          <Button onClick={() => setOpenSuperpowerModal(true)}>add</Button>
          <Modal opened={openSuperpowerModal} onClose={() => setOpenSuperpowerModal(false)}>
            <TextInput
              label="Superpower"
              placeholder="因为..SDK..算法能干.."
              value={inputSuperPower}
              onChange={(event) => setInputSuperPower(event.target.value)}
            />
            <Button
              disabled={!inputSuperPower}
              onClick={async () => {
                await supabase
                  .from('superpower')
                  .insert([{ user_id: user.id, superpower_name: inputSuperPower }]);
                setOpenSuperpowerModal(false);
                updateSuperPower();
                setInputSuperPower('');
              }}
            >
              Submit
            </Button>
          </Modal>
          <ScrollArea sx={{ height: `${height - 100}px` }}>
            {superPowerList.map((superpower) => (
              <Box component="div" key={superpower.id}>
                <Flex gap="sm" justify="flex-start" align="center" direction="row" wrap="nowrap">
                  <ActionIcon
                    color="blue"
                    radius="lg"
                    variant="filled"
                    ml="sm"
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from('superpower')
                        .delete()
                        .eq('id', `${superpower.id}`);
                      if (error) {
                        alert(error.message);
                      }
                      updateSuperPower();
                    }}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                  <Text
                    mx="xs"
                    fz="sm"
                    style={{
                      backgroundColor:
                        selectedSuperPower && selectedSuperPower.id === superpower.id
                          ? 'rgb(239 68 68)'
                          : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedSuperPower(superpower);
                    }}
                  >
                    {superpower.superpower_name}
                  </Text>
                </Flex>
                <Divider my="xs" variant="dashed"></Divider>
              </Box>
            ))}
          </ScrollArea>
        </Stack>
      </SimpleGrid>
      <Flex className="w-full" justify="center" align="center" direction="row" wrap="nowrap">
        <Button
          mx="sm"
          disabled={!(selectedRole && selectedTrouble && selectedSuperPower)}
          onClick={() => {
            setOpenIdeaModal(true);
          }}
        >
          add idea
        </Button>

        <Modal opened={openIdeaModal} onClose={() => setOpenIdeaModal(false)}>
          <TextInput
            label="New Insight"
            placeholder="可以(用..干..)"
            value={inputNewInsight}
            onChange={(event) => setInputNewInsight(event.target.value)}
          />
          <TextInput
            label="Idea Name"
            placeholder="从而(使用户..)"
            value={inputIdeaName}
            onChange={(event) => setInputIdeaName(event.target.value)}
          />

          <TextInput
            label="Advantage"
            placeholder="我适合做这个产品因为.."
            value={inputAdvantage}
            onChange={(event) => setInputAdvantage(event.target.value)}
          />
          <TextInput
            label="Keyword"
            placeholder="推广用的关键词"
            value={inputKeyword}
            onChange={(event) => setInputKeyword(event.target.value)}
          />
          <Button
            onClick={async () => {
              await supabase.from('idea').insert([
                {
                  user_id: user.id,
                  superpower_id: selectedSuperPower.id,
                  role_id: selectedRole.id,
                  trouble_id: selectedTrouble.id,
                  idea_name: inputIdeaName,
                  new_insight: inputNewInsight,
                  advantage: inputAdvantage,
                  keyword: inputKeyword,
                },
              ]);
              setOpenIdeaModal(false);
              updateIdeaList();
              setInputNewInsight('');
              setInputIdeaName('');
              setInputAdvantage('');
              setInputKeyword('');
            }}
          >
            Submit
          </Button>
        </Modal>
      </Flex>
      <ScrollArea className="bg-teal-50	" sx={{ height: `${height - 40}px` }}>
        {ideaList.map((idea) => (
          <Box component="div" className="w-full" key={idea.id}>
            <Divider my="sm" variant="dashed" />
            <Group>
              <ActionIcon
                ml="sm"
                color="blue"
                radius="xl"
                variant="light"
                onClick={async () => {
                  setCurrentIdea(idea);
                  setOpenIdeaDetailModal(true);
                }}
              >
                <IconDots size="1rem" />
              </ActionIcon>
              <Text
                fz="sm"
                c="dark"
                className="w-[90%]"
              >{`${idea.role_name}${idea.trouble_name}.因为${idea.superpower_name},所以可以${idea.new_insight},从而${idea.idea_name}.我适合做这个产品因为${idea.advantage}.产品推广关键词如下:${idea.keyword}`}</Text>
            </Group>
          </Box>
        ))}
      </ScrollArea>
      <Modal opened={openIdeaDetailModal} onClose={() => setOpenIdeaDetailModal(false)}>
        {currentIdea && (
          <>
            <Button
              onClick={async () => {
                await supabase.from('idea').delete().eq('id', currentIdea.id);
                setOpenIdeaDetailModal(false);
                updateIdeaList();
              }}
            >
              Delete Idea
            </Button>
          </>
        )}
      </Modal>
    </Box>
  );
}
