import Input from '../base/Input';
import SelectBoxKeyValue from '../base/SelectBoxKeyValue';

type Props = {
  searchText: string;
  setSearchText: any;
  ItemsFilter: Array<any>;
  typeFilter: any;
  setTypeFilter: any;
};

const SearchBar = ({
  searchText,
  setSearchText,
  ItemsFilter,
  typeFilter,
  setTypeFilter,
}: Props) => {
  return (
    <div className="flex gap-4 mb-5">
      <Input
        placeholder="Tìm kiếm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <SelectBoxKeyValue
        width={'200px'}
        items={ItemsFilter}
        selected={typeFilter}
        setSelected={setTypeFilter}
      />
    </div>
  );
};

export default SearchBar;
