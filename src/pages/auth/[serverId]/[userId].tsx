import {
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import Layout from "components/common/Layout"
import { useRouter } from "next/router"
import { DiscordLogo } from "phosphor-react"
import { useEffect } from "react"

const Page = (): JSX.Element => {
  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()
  const router = useRouter()
  const { account } = useWeb3React()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout title="Authentication">
      {account ? (
        <>
          {/* <Alert status="error" mb="6" pb="5">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1} fontWeight="semibold">
                Invalid server ID or user ID!
              </AlertDescription>
            </Stack>
          </Alert> */}
          <Card px={{ base: 5, md: 7 }} py={{ base: 7, md: 9 }} mx="auto" maxW="md">
            <VStack width="full" alignItems="start" spacing={4}>
              <Heading as="h2" mb={2} fontFamily="display" fontSize="xl">
                Connect with Discord
              </Heading>
              <Text>
                In order to join every guild on this Discord server, please connect
                with your Discord account.
              </Text>
              <Flex alignItems="center" pt={8} width="full">
                <Button
                  mx="auto"
                  colorScheme="DISCORD"
                  leftIcon={<Icon as={DiscordLogo} />}
                >
                  Authenticate with Discord
                </Button>
              </Flex>
            </VStack>
          </Card>
        </>
      ) : (
        <ConnectWalletAlert />
      )}
    </Layout>
  )
}

export default Page
