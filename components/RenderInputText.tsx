import { Stack } from "native-base";
import { InputForm, SelectDropdownForm } from "./Form";

export default (item: any, formData: any, setData: any, errors: any, groupInput?: string) => {
  switch (item.type) {
    case 1:
    case 5:
      if (item.visibility != 3) {
        return (
          <Stack space={2} pb="2">
            <InputForm
              data={{
                name: item.name,
                id: item.id,
                title: item.description,
                placeholder: item.description,
                keyboardType: item.type == 1 ? "default" : "number-pad",
                value: item.type == 1 ? item.stringValue : item.intValue,
                formData,
                setData,
                require: !item.nullable,
                errors,
                groupInput
              }}
            />
          </Stack>
        )
      }
      break;
    case 8:
    case 9:
      let sortedValues = item.values.sort((p1: any, p2: any) =>
        p1.code > p2.code ? 1 : p1.code < p2.code ? -1 : 0
      );
      if (item.visibility != 3) {
        return (<Stack space={2} pb="2">
          <SelectDropdownForm
            data={{
              name: item.name,
              id: item.id,
              type: item.type,
              selectData: sortedValues,
              search: false,
              disabled: item.visibility == 2,
              title: item.description,
              placeholder: item.description,
              value: item.type == 8 ? item.stringValue : item.intValue,
              require: !item.nullable,
              formData,
              setData,
              errors,
              groupInput
            }} />
        </Stack>)
      }
  }
}