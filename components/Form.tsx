import { FontAwesome } from "@expo/vector-icons";
import { t } from "i18next";
import {
  FormControl,
  Input,
  Text,
  WarningOutlineIcon,
  Box,
} from "native-base";
import { Platform, TouchableWithoutFeedback, StyleSheet } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';

export const InputForm = ({ data }: { data: any }) => {
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <Input
        placeholder={data.placeholder}
        defaultValue={data.value}
        isReadOnly={data.readonly}
        onTouchStart={data.onItemClick}
        {...(data.readonly && { value: data.value })}
        {...(data.keyboardType && { keyboardType: data.keyboardType })}
        onChangeText={(value) =>
          data.setData({ ...data.formData, [data.name]: value })
        }
      />
    </FormControl>
  );
};

export const InputDate = ({ data }: { data: any }) => {

  return (
    <TouchableWithoutFeedback onPress={data.onItemClick}>
      <FormControl
        w={data.col === true ? "1/2" : "full"}
        px={data.col === true ? "2" : 0}
        {...(data.require && { isRequired: true })}
        isInvalid={`${data.name}` in data.errors}
      >
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          {data.title}
        </FormControl.Label>

        <Box
          borderColor={'#d4d4d4'}
          borderWidth={1}
          borderRadius={'5'}
          height={Platform.OS == 'ios' ? "1/3" : "12"}
          padding={"2"}
        >
          <Text>{data.value ? data.value : t("cotiza.placeholder.date")}</Text>
        </Box>
        {`${data.name}` in data.errors ? (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {data.errors[data.name]}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>{data.description}</FormControl.HelperText>
        )}
      </FormControl>
    </TouchableWithoutFeedback>
  )
}

export const SelectDropdownForm = (dataObj: any) => {
  const { data } = dataObj;
  const countries = data.selectData.map((item: any) => item.description)
  return (
    <FormControl
      w={data.col === true ? "1/2" : "full"}
      px={data.col === true ? "2" : 0}
      {...(data.require && { isRequired: true })}
    >
      <FormControl.Label
        _text={{
          bold: true,
        }}
      >
        {data.title}
      </FormControl.Label>
      <SelectDropdown
        data={countries}
        onSelect={(selectedItem, index) => {
        }}
        defaultButtonText={data.placeholder}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        {...(data.search && { search: true })}
        searchInputStyle={styles.dropdown1searchInputStyleStyle}
        searchPlaceHolder={t('filter')}
        searchPlaceHolderColor={'darkgrey'}
        renderSearchInputLeftIcon={() => {
          return <FontAwesome name={'search'} color={'darkgrey'} size={18} />;
        }}
        buttonStyle={styles.dropdown1BtnStyle}
        buttonTextStyle={styles.dropdown1BtnTxtStyle}
        renderDropdownIcon={isOpened => {
          return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'darkgrey'} size={12} />;
        }}
        dropdownIconPosition={'right'}
        dropdownStyle={styles.dropdown1DropdownStyle}
        rowStyle={styles.dropdown1RowStyle}
        rowTextStyle={styles.dropdown1RowTxtStyle}
      />
    </FormControl>
  )
};

const styles = StyleSheet.create({

  dropdown1BtnStyle: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 35,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 12 },
  dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
  dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontSize: 12 },
  dropdown1searchInputStyleStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d4',
  },
})
