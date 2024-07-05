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
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Link from 'next/link';
import { SnapshotFormValues } from './SnapshotCard';
import { useChain, useWallet } from '@cosmos-kit/react';
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
    const { connect, isWalletConnected, address } =
        useChain("stargaze");

    const [isAutofilled, setIsAutofilled] = useState(false);  // State to track autofill

    const onAutofillClick = async () => {
        if (!isWalletConnected) {
            await connect("keplr-extension");
            return;
        }
        try {
            if (!address) throw new Error("Address not defined");
            setValue("stars_address", address, { shouldValidate: true });
            setIsAutofilled(true);  // Set autofilled to true when an address is imported
        } catch (e) {
            setIsAutofilled(false);  // Reset autofilled to false on error
            const error = e as Error;
            toast({
                title: "Keplr not found",
                description: (
                    <Text>
                        <>
                            <Link href="https://www.keplr.app/download" passHref={true}>
                                <a target="_blank" style={{ color: 'white' }}>
                                    Please install Keplr extension
                                </a>
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
                    color={isAutofilled ? "black" : "white"}  // Change text color based on autofill state
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
