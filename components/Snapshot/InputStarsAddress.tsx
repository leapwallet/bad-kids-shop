import {
    Stack,
    Input,
    Text,
    HStack,
    InputProps,
    FormErrorMessage,
    Box,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import Link from 'next/link';
import { SnapshotFormValues, STARGAZE_CHAIN_ID } from './SnapshotCard';
import KeplrLogo from "../../public/keplr.png";
import Image from "next/image";

export const InputStarsAddress: React.FC<InputProps> = ({
    children,
    ...rest
}) => {
    const toast = useToast();
    const { register, setValue, getFieldState } =
        useFormContext<SnapshotFormValues>();
    const isError = !!getFieldState("stars_address").error;

    const onAutofillClick = async () => {
        const offlineSigner = window.keplr.getOfflineSigner(STARGAZE_CHAIN_ID);
        const accounts = await offlineSigner.getAccounts();
        if (!accounts[0].address) {
            window.keplr.enable("stargaze")
        }
        try {
            if (!accounts[0].address) throw new Error("Address not defined");
            setValue("stars_address", accounts[0].address, { shouldValidate: true });
        } catch (e) {
            const error = e as Error;
            toast({
                title: "Keplr not found",
                description: (
                    <Text>
                        <>
                            <Link href="https://www.keplr.app/download" target="_blank" passHref={true} style={{ color: 'white' }}>
                                Please install Keplr extension
                            </Link>
                        </>
                    </Text>
                ),
                status: "error",
                isClosable: true
            });
        }
    };

    return (
        <Stack spacing={2}>
            <HStack justifyContent="space-between">
                <Text fontWeight="bold" color="white" fontSize="sm">
                    Stars Address
                </Text>
                <HStack
                    as="button"
                    type="button"
                    spacing={1}
                    onClick={onAutofillClick}
                    color="white"
                >
                    <Text fontWeight="bold" fontSize="sm">
                        Import from Keplr
                    </Text>
                    <Image
                        src={KeplrLogo}
                        alt="Keplr logo"
                        width={24}
                        height={24}
                    />
                </HStack>
            </HStack>
            <Box
                boxShadow={isError ? "redOutline1" : "purpleOutline1"}
                borderRadius="16px"
            >
                <Input
                    id="sommelierAddress"
                    placeholder="Enter Stargaze address"
                    fontSize="sm"
                    fontWeight={700}
                    backgroundColor="gray.950"
                    color="black"
                    variant="unstyled"
                    borderRadius="16px"
                    px={4}
                    py={6}
                    maxH="64px"
                    type="text"
                    {...register("stars_address", {
                        required: "Enter Stargaze address",
                    })}
                    autoComplete="off"
                    autoCorrect="off"
                    {...rest}
                />
            </Box>
            {isError && (
                <FormErrorMessage>
                    <HStack spacing="6px">
                        <Text fontSize="sm" fontWeight="semibold" color="red.300">
                            Address is not valid—make sure Sommelier address is from a
                            Cosmos wallet
                        </Text>
                    </HStack>
                </FormErrorMessage>
            )}
        </Stack>
    );
};
