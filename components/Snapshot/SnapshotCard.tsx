import React from "react"
import {
    Heading,
    VStack,
    Text,
    Box,
    Stack,
} from "@chakra-ui/react"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import { FormProvider, useForm } from 'react-hook-form';
import SnapshotForm from './SnapshotForm';

export interface SnapshotFormValues {
    eth_address: string
    somm_address: string
}

export const SnapshotCard: React.FC = () => {
    const { isConnected } = useAccount()
    const { chain: wagmiChain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork()
    const methods = useForm<SnapshotFormValues>({
        defaultValues: {
            eth_address: "",
            somm_address: "",
        },
    })
    const ethChainWagmiId = 1;


    const ethChainId = 1 // Ethereum Mainnet ID
    const isWrongNetwork = !!wagmiChain && wagmiChain.id !== ethChainId
    return (
        <>
            {isConnected && isWrongNetwork && (
                <Box
                    p={4}
                    mb={12}
                    backgroundColor="purple.dark"
                    border="2px solid"
                    borderRadius={16}
                    borderColor="purple.base"
                    width="full"
                    zIndex={2} // Ensures it overlays other content if needed
                >
                    <VStack spacing={4}>
                        <Heading size="md">
                            <Text>Wrong Network</Text>
                        </Heading>
                        <Text>
                            Your connected wallet is on the {wagmiChain?.name}{" "}
                            network. Please switch to Ethereum Mainnet to use this
                            feature.
                        </Text>
                        <button
                            onClick={async () => {
                                try {
                                    if (switchNetworkAsync) {
                                        await switchNetworkAsync(ethChainWagmiId)
                                        window.location.reload()
                                    }
                                } catch (e) {
                                    const error = e as Error
                                    console.error(error)
                                }
                            }}
                        >
                            Switch to Ethereum Mainnet
                        </button>
                    </VStack>
                </Box>
            )}
            <Stack
                direction={{ base: "column", md: "row" }}
                spacing={10}
                width="full"
            >
                <Box
                    maxW="432px"
                    w="full"
                    boxShadow="purpleOutline1"
                    px={{ base: 5, md: 12 }}
                    pt="52px"
                    pb="48px"
                    borderRadius={{ base: "32px", md: "40px" }}
                    mx={4}
                >
                    <Heading as="h4" size="lg" mb={4}>
                        Snapshot
                    </Heading>
                    <Text mb={4}>
                        Link your wallets for bonus SOMM rewards and/or
                        participate in partner campaigns.
                    </Text>
                    <FormProvider {...methods}>
                        <SnapshotForm wrongNetwork={isWrongNetwork} />
                    </FormProvider>
                </Box>
                {/*<CampaignTable />*/}
            </Stack>
        </>
    )
}

export default SnapshotCard
