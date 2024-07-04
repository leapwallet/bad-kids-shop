import {
    Stack,
    Input,
    Text,
    HStack,
    InputProps,
    FormErrorMessage,
    Box,
    useToast,
} from "@chakra-ui/react"
import React from "react"
import { useFormContext } from "react-hook-form"
import Link from 'next/link';
import { SnapshotFormValues } from './SnapshotCard';
import { useChain } from '@cosmos-kit/react';
import KeplrLogo from "../../public/keplr.png"
import Image from "next/image";

export const InputSommelierAddress: React.FC<InputProps> = ({
                                                                children,
                                                                ...rest
                                                            }) => {
    const toast = useToast()
    const { register, setValue, getValues, getFieldState } =
        useFormContext<SnapshotFormValues>()
    const isError = !!getFieldState("somm_address").error
    const { getOfflineSignerDirect, connect, isWalletConnected } =
        useChain("stargaze");


    const onAutofillClick = async () => {
        if (!isWalletConnected) {
            connect();
            return <></>;
        }
        try {
            const signer = getOfflineSignerDirect();
            const address = await signer.getAccounts()
            if (!address[0].address) throw new Error("Address not defined")
            setValue(
                "somm_address",
                address[0].address,
                {
                    shouldValidate: true,
                }
            )
        } catch (e) {
            const error = e as Error

            return toast({
                title: "Keplr not found",
                description: (
                    <Text>
                        {" "}
                        <>
                            <Link
                                href="https://www.keplr.app/download"
                            >
                                <Text as="span">Please install Keplr extension</Text>
                            </Link>
                        </>
                    </Text>
                ),
                status: "error",
                isClosable: true
            })
        }
    }

    return (
        <Stack spacing={2}>
            <HStack justifyContent="space-between">
                <Text fontWeight="bold" color="neutral.400" fontSize="xs">
                    Sommelier Address
                </Text>
                <HStack
                    as="button"
                    type="button"
                    spacing={1}
                    onClick={() => onAutofillClick()}
                >
                    <Text fontWeight="bold" color="white" fontSize="xs">
                        Import from Keplr
                    </Text>
                    <Image
                        src={KeplrLogo}
                        alt="Keplr logo"
                        width={10}
                    />
                </HStack>
            </HStack>
            <Box
                boxShadow={isError ? "redOutline1" : "purpleOutline1"}
                borderRadius="16px"
            >
                <Input
                    id="sommelierAddress"
                    placeholder="Enter Sommelier address"
                    fontSize="xs"
                    fontWeight={700}
                    backgroundColor="surface.tertiary"
                    variant="unstyled"
                    borderRadius="16px"
                    px={4}
                    py={6}
                    maxH="64px"
                    _placeholder={{
                        fontSize: "lg",
                    }}
                    type="text"
                    {...register("somm_address", {
                        required: "Enter Sommelier address",
                        // validate: {
                        //     validAddress: (v) =>
                        //         validateSommelierAddress(v) || "Address is not valid",
                        // },
                    })}
                    autoComplete="off"
                    autoCorrect="off"
                    {...rest}
                />
            </Box>
            <FormErrorMessage>
                <HStack spacing="6px">
                    <Text fontSize="xs" fontWeight="semibold" color="red.light">
                        Address is not valid—make sure Sommelier address is from a
                        Cosmos wallet
                    </Text>
                </HStack>
            </FormErrorMessage>
        </Stack>
    )
}
